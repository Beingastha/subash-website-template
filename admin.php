<?php
// Prevent caching of CMS pages in browser and proxies
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

session_start();
define('SECURE_ACCESS', true);

$keys_file = __DIR__ . '/data/keys.php';
if (file_exists($keys_file)) {
    include($keys_file);
} else {
    $MASTER_KEY = 'excellence_master_2026';
    $ACCESS_KEYS = array();
}

$error_msg = '';
$success_msg = '';

// Handle Authentication
if (isset($_POST['action']) && $_POST['action'] === 'login') {
    $key = trim($_POST['access_key'] ?? '');
    if ($key === $MASTER_KEY) {
        $_SESSION['admin_key'] = $key;
        $_SESSION['is_master'] = true;
        header('Location: admin.php');
        exit;
    } elseif (array_key_exists($key, $ACCESS_KEYS)) {
        $_SESSION['admin_key'] = $key;
        $_SESSION['is_master'] = false;
        header('Location: admin.php');
        exit;
    } else {
        $error_msg = "Invalid Access Key. Please try again.";
    }
}

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: admin.php');
    exit;
}

$is_logged_in = isset($_SESSION['admin_key']);
$is_master = $_SESSION['is_master'] ?? false;

// Read last active tab from requests to prevent UI layout reset on submit
$req_tab = $_POST['active_tab'] ?? $_GET['active_tab'] ?? '';
$default_tab = $is_master ? 'general-tab' : 'contact-tab';
if ($is_logged_in && !empty($req_tab)) {
    if ($is_master || $req_tab === 'contact-tab') {
        $default_tab = htmlspecialchars($req_tab);
    }
}

// Helper to save data back to JSON and JS config
function saveData($json_data, $data_file, $js_file) {
    $new_json = json_encode($json_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (file_put_contents($data_file, $new_json) === false) {
        return false;
    }
    $new_js = "window.schoolData = " . $new_json . ";\n";
    if (file_put_contents($js_file, $new_js) === false) {
        return false;
    }
    return true;
}

// Helper to handle dynamic image uploads
function handleImageUpload($file_key, $current_path) {
    if (!isset($_FILES[$file_key]) || $_FILES[$file_key]['error'] !== UPLOAD_ERR_OK) {
        return $current_path;
    }
    
    $file = $_FILES[$file_key];
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $file_type = mime_content_type($file['tmp_name']);
    
    if (!in_array($file_type, $allowed_types)) {
        throw new Exception("Invalid file type for '{$file_key}'. Only JPG, PNG, GIF, and WEBP images are allowed.");
    }
    
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    if (empty($ext)) {
        $ext = ($file_type === 'image/png') ? 'png' : (($file_type === 'image/webp') ? 'webp' : (($file_type === 'image/gif') ? 'gif' : 'jpg'));
    }
    
    $filename = $file_key . '_' . time() . '.' . $ext;
    $target_dir = __DIR__ . '/images/';
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0755, true);
    }
    
    $target_path = $target_dir . $filename;
    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        return '/images/' . $filename;
    } else {
        throw new Exception("Failed to save uploaded file '{$file_key}' to target directory. Check write permissions.");
    }
}

// Handle Logged In CMS Actions
if ($is_logged_in) {
    $data_file = __DIR__ . '/data/school-data.json';
    $js_file = __DIR__ . '/js/data.js';

    if (file_exists($data_file)) {
        $json_data = json_decode(file_get_contents($data_file), true);

        // Security check: Non-master users can only perform 'update_contact' or 'logout'
        $post_action = $_POST['action'] ?? '';
        $get_action = $_GET['action'] ?? '';
        
        $is_allowed = true;
        if (!$is_master) {
            if (!empty($post_action) && $post_action !== 'update_contact') {
                $is_allowed = false;
            }
            if (!empty($get_action) && !in_array($get_action, ['logout'])) {
                $is_allowed = false;
            }
        }

        if (!$is_allowed) {
            $error_msg = "Access Denied: You do not have permissions to modify this section.";
        } else {
            try {
            // ACTION 1: UPDATE GENERAL INFO & STATS
            if (isset($_POST['action']) && $_POST['action'] === 'update_general') {
                $json_data['school']['fullName'] = trim($_POST['fullName'] ?? '');
                $json_data['school']['shortName'] = trim($_POST['shortName'] ?? '');
                $json_data['school']['establishedYear'] = intval($_POST['establishedYear'] ?? 2002);
                $json_data['school']['type'] = trim($_POST['type'] ?? '');
                $json_data['school']['department'] = trim($_POST['department'] ?? '');
                $json_data['school']['board'] = trim($_POST['board'] ?? '');
                $json_data['school']['udiseCode'] = trim($_POST['udiseCode'] ?? '');
                $json_data['school']['medium'] = trim($_POST['medium'] ?? '');
                $json_data['school']['grades'] = trim($_POST['grades'] ?? '');
                
                // Update stats
                for ($i = 0; $i < 4; $i++) {
                    if (isset($json_data['statistics'][$i])) {
                        $json_data['statistics'][$i]['value'] = intval($_POST["stat_val_{$i}"] ?? 0);
                        $json_data['statistics'][$i]['suffix'] = trim($_POST["stat_suf_{$i}"] ?? '');
                        $json_data['statistics'][$i]['label'] = trim($_POST["stat_lab_{$i}"] ?? '');
                    }
                }

                // Handle optional Hero image upload
                $json_data['images']['hero'] = handleImageUpload('hero_img', $json_data['images']['hero']);

                if (saveData($json_data, $data_file, $js_file)) {
                    $success_msg = "General school information and statistics updated successfully!";
                } else {
                    $error_msg = "Failed to write updates to data files. Check file permissions.";
                }
            }

            // ACTION 2: UPDATE CONTACT DETAILS
            elseif (isset($_POST['action']) && $_POST['action'] === 'update_contact') {
                $json_data['school']['contact']['phone'] = trim($_POST['phone'] ?? '');
                $json_data['school']['contact']['email'] = trim($_POST['email'] ?? '');
                $json_data['school']['contact']['officeHours'] = trim($_POST['officeHours'] ?? '');

                $json_data['school']['address']['street'] = trim($_POST['street'] ?? '');
                $json_data['school']['address']['area'] = trim($_POST['area'] ?? '');
                $json_data['school']['address']['city'] = trim($_POST['city'] ?? '');
                $json_data['school']['address']['state'] = trim($_POST['state'] ?? '');
                $json_data['school']['address']['pincode'] = trim($_POST['pincode'] ?? '');

                $json_data['school']['social']['facebook'] = trim($_POST['facebook'] ?? '');
                $json_data['school']['social']['instagram'] = trim($_POST['instagram'] ?? '');
                $json_data['school']['social']['linkedin'] = trim($_POST['linkedin'] ?? '');
                $json_data['school']['social']['youtube'] = trim($_POST['youtube'] ?? '');

                if (saveData($json_data, $data_file, $js_file)) {
                    $success_msg = "Contact details updated successfully!";
                } else {
                    $error_msg = "Failed to write updates to data files. Check file permissions.";
                }
            }

            // ACTION 3: UPDATE PRINCIPAL MESSAGE
            elseif (isset($_POST['action']) && $_POST['action'] === 'update_principal') {
                $json_data['principal']['name'] = trim($_POST['p_name'] ?? '');
                $json_data['principal']['qualification'] = trim($_POST['p_qual'] ?? '');
                $json_data['principal']['experience'] = trim($_POST['p_exp'] ?? '');
                $json_data['principal']['message'] = trim($_POST['p_msg'] ?? '');
                $json_data['principal']['vision'] = trim($_POST['p_vision'] ?? '');
                $json_data['principal']['mission'] = trim($_POST['p_mission'] ?? '');

                // Handle principal photo upload
                $json_data['images']['principal'] = handleImageUpload('principal_photo', $json_data['images']['principal']);

                if (saveData($json_data, $data_file, $js_file)) {
                    $success_msg = "Principal desk message and info updated successfully!";
                } else {
                    $error_msg = "Failed to write updates to data files. Check file permissions.";
                }
            }

            // ACTION 4: NOTICE BOARD - ADD NOTICE
            elseif (isset($_POST['action']) && $_POST['action'] === 'add_notice') {
                $title = trim($_POST['n_title'] ?? '');
                $date = trim($_POST['n_date'] ?? date('M d, Y'));
                $description = trim($_POST['n_desc'] ?? '');
                $important = isset($_POST['n_important']);

                if (!empty($title)) {
                    $new_id = 1;
                    foreach (($json_data['notices'] ?? []) as $n) {
                        if ($n['id'] >= $new_id) {
                            $new_id = $n['id'] + 1;
                        }
                    }
                    $json_data['notices'][] = [
                        'id' => $new_id,
                        'title' => $title,
                        'date' => $date,
                        'description' => $description,
                        'important' => $important
                    ];
                    if (saveData($json_data, $data_file, $js_file)) {
                        $success_msg = "Notice '{$title}' added successfully!";
                    } else {
                        $error_msg = "Failed to save the notice.";
                    }
                } else {
                    $error_msg = "Notice title cannot be empty.";
                }
            }

            // ACTION 5: NOTICE BOARD - DELETE NOTICE
            elseif (isset($_GET['action']) && $_GET['action'] === 'delete_notice') {
                $id = intval($_GET['id'] ?? 0);
                $found = false;
                foreach (($json_data['notices'] ?? []) as $idx => $n) {
                    if ($n['id'] === $id) {
                        unset($json_data['notices'][$idx]);
                        $json_data['notices'] = array_values($json_data['notices']);
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    if (saveData($json_data, $data_file, $js_file)) {
                        $success_msg = "Notice removed successfully.";
                    } else {
                        $error_msg = "Failed to update notices list.";
                    }
                }
            }

            // ACTION 6: FACULTY MEMBERS - ADD TEACHER
            elseif (isset($_POST['action']) && $_POST['action'] === 'add_teacher') {
                $t_name = trim($_POST['t_name'] ?? '');
                $t_desg = trim($_POST['t_desg'] ?? '');
                $t_qual = trim($_POST['t_qual'] ?? '');
                $t_sub = trim($_POST['t_sub'] ?? '');
                $t_exp = trim($_POST['t_exp'] ?? '');
                $t_role = trim($_POST['t_role'] ?? '');

                if (!empty($t_name)) {
                    $new_id = 1;
                    foreach (($json_data['teachers'] ?? []) as $t) {
                        if ($t['id'] >= $new_id) {
                            $new_id = $t['id'] + 1;
                        }
                    }
                    $json_data['teachers'][] = [
                        'id' => $new_id,
                        'name' => $t_name,
                        'designation' => $t_desg,
                        'qualification' => $t_qual,
                        'subject' => $t_sub,
                        'experience' => $t_exp,
                        'specialRole' => $t_role
                    ];
                    if (saveData($json_data, $data_file, $js_file)) {
                        $success_msg = "Faculty member '{$t_name}' added successfully!";
                    } else {
                        $error_msg = "Failed to save the teacher details.";
                    }
                } else {
                    $error_msg = "Teacher name cannot be empty.";
                }
            }

            // ACTION 7: FACULTY MEMBERS - DELETE TEACHER
            elseif (isset($_GET['action']) && $_GET['action'] === 'delete_teacher') {
                $id = intval($_GET['id'] ?? 0);
                $found = false;
                foreach (($json_data['teachers'] ?? []) as $idx => $t) {
                    if ($t['id'] === $id) {
                        unset($json_data['teachers'][$idx]);
                        $json_data['teachers'] = array_values($json_data['teachers']);
                        $found = true;
                        break;
                    }
                }
                if ($found) {
                    if (saveData($json_data, $data_file, $js_file)) {
                        $success_msg = "Faculty member removed successfully.";
                    } else {
                        $error_msg = "Failed to update faculty list.";
                    }
                }
            }

            // ACTION 8: ACADEMIC DETAILS
            elseif (isset($_POST['action']) && $_POST['action'] === 'update_academics') {
                $json_data['academics']['curriculum'] = trim($_POST['a_curr'] ?? '');
                $json_data['academics']['description'] = trim($_POST['a_desc'] ?? '');

                $streams = explode(',', $_POST['a_streams'] ?? '');
                $json_data['academics']['streams'] = array_map('trim', $streams);

                // Update Academic Facilities (Science Labs, Computer/ATL, Library)
                for ($i = 0; $i < 3; $i++) {
                    if (isset($json_data['academics']['facilities'][$i])) {
                        $json_data['academics']['facilities'][$i]['title'] = trim($_POST["fac_title_{$i}"] ?? '');
                        $json_data['academics']['facilities'][$i]['description'] = trim($_POST["fac_desc_{$i}"] ?? '');
                        
                        // Handle facility image upload
                        $json_data['academics']['facilities'][$i]['image'] = handleImageUpload("fac_img_{$i}", $json_data['academics']['facilities'][$i]['image']);
                    }
                }

                if (saveData($json_data, $data_file, $js_file)) {
                    $success_msg = "Academic details and facilities updated successfully!";
                } else {
                    $error_msg = "Failed to write updates to data files.";
                }
            }

            // ACTION 9: SPORTS & ACTIVITIES
            elseif (isset($_POST['action']) && $_POST['action'] === 'update_activities') {
                // Update Badminton, Boxing, Cricket
                for ($i = 0; $i < 3; $i++) {
                    if (isset($json_data['activities']['featured'][$i])) {
                        $json_data['activities']['featured'][$i]['description'] = trim($_POST["act_desc_{$i}"] ?? '');
                        $json_data['activities']['featured'][$i]['facilities'] = trim($_POST["act_fac_{$i}"] ?? '');
                        $json_data['activities']['featured'][$i]['coaching'] = trim($_POST["act_coach_{$i}"] ?? '');
                        $json_data['activities']['featured'][$i]['achievements'] = trim($_POST["act_ach_{$i}"] ?? '');
                        $json_data['activities']['featured'][$i]['schedule'] = trim($_POST["act_sched_{$i}"] ?? '');

                        // Handle activity image upload
                        $json_data['activities']['featured'][$i]['image'] = handleImageUpload("act_img_{$i}", $json_data['activities']['featured'][$i]['image']);
                    }
                }

                // Update other activities
                for ($i = 0; $i < 6; $i++) {
                    if (isset($json_data['activities']['other'][$i])) {
                        $json_data['activities']['other'][$i]['description'] = trim($_POST["other_act_desc_{$i}"] ?? '');
                    }
                }

                if (saveData($json_data, $data_file, $js_file)) {
                    $success_msg = "Sports and extracurricular activities updated successfully!";
                } else {
                    $error_msg = "Failed to write updates to data files.";
                }
            }

            // ACTION 10: HOSTEL & RULES
            elseif (isset($_POST['action']) && $_POST['action'] === 'update_hostel') {
                $json_data['hostel']['overview'] = trim($_POST['h_overview'] ?? '');
                $json_data['hostel']['capacity'] = intval($_POST['h_capacity'] ?? 100);

                // Update Wardens
                for ($i = 0; $i < 2; $i++) {
                    if (isset($json_data['hostel']['wardens'][$i])) {
                        $json_data['hostel']['wardens'][$i]['name'] = trim($_POST["w_name_{$i}"] ?? '');
                        $json_data['hostel']['wardens'][$i]['designation'] = trim($_POST["w_desg_{$i}"] ?? '');
                        $json_data['hostel']['wardens'][$i]['phone'] = trim($_POST["w_phone_{$i}"] ?? '');
                    }
                }

                // Update Rules (dynamic array from POST)
                $rules = $_POST['h_rules'] ?? [];
                $clean_rules = [];
                foreach ($rules as $r) {
                    if (!empty(trim($r))) {
                        $clean_rules[] = trim($r);
                    }
                }
                $json_data['hostel']['rules'] = $clean_rules;

                if (saveData($json_data, $data_file, $js_file)) {
                    $success_msg = "Hostel details and rules updated successfully!";
                } else {
                    $error_msg = "Failed to write updates to data files.";
                }
            }

            // ACTION 11: TESTIMONIALS - ADD
            elseif (isset($_POST['action']) && $_POST['action'] === 'add_testimonial') {
                $test_name = trim($_POST['tst_name'] ?? '');
                $test_role = trim($_POST['tst_role'] ?? '');
                $test_quote = trim($_POST['tst_quote'] ?? '');
                $test_stars = intval($_POST['tst_stars'] ?? 5);

                if (!empty($test_name)) {
                    $json_data['testimonials'][] = [
                        'name' => $test_name,
                        'role' => $test_role,
                        'quote' => $test_quote,
                        'stars' => $test_stars
                    ];
                    if (saveData($json_data, $data_file, $js_file)) {
                        $success_msg = "Review from '{$test_name}' added successfully!";
                    } else {
                        $error_msg = "Failed to save review details.";
                    }
                } else {
                    $error_msg = "Reviewer name cannot be empty.";
                }
            }

            // ACTION 12: TESTIMONIALS - DELETE
            elseif (isset($_GET['action']) && $_GET['action'] === 'delete_testimonial') {
                $idx_to_del = intval($_GET['idx'] ?? -1);
                if ($idx_to_del >= 0 && isset($json_data['testimonials'][$idx_to_del])) {
                    unset($json_data['testimonials'][$idx_to_del]);
                    $json_data['testimonials'] = array_values($json_data['testimonials']);
                    if (saveData($json_data, $data_file, $js_file)) {
                        $success_msg = "Review deleted successfully.";
                    } else {
                        $error_msg = "Failed to update review list.";
                    }
                }
            }

            // ACCESS KEY ACTIONS (Master Only)
            elseif ($is_master && isset($_POST['action']) && $_POST['action'] === 'add_key') {
                $new_key = trim($_POST['new_key'] ?? '');
                $new_label = trim($_POST['new_label'] ?? 'Staff Key');

                if (empty($new_key)) {
                    $error_msg = "Access key cannot be empty.";
                } elseif ($new_key === $MASTER_KEY || array_key_exists($new_key, $ACCESS_KEYS)) {
                    $error_msg = "This access key already exists.";
                } else {
                    $ACCESS_KEYS[$new_key] = $new_label;
                    $keys_content = "<?php\n"
                                  . "if (!defined('SECURE_ACCESS')) die('Direct access forbidden');\n"
                                  . "\$MASTER_KEY = " . var_export($MASTER_KEY, true) . ";\n"
                                  . "\$ACCESS_KEYS = " . var_export($ACCESS_KEYS, true) . ";\n";
                    if (file_put_contents($keys_file, $keys_content)) {
                        $success_msg = "Access key '{$new_label}' added successfully!";
                    } else {
                        $error_msg = "Failed to save the new key.";
                    }
                }
            }

            elseif ($is_master && isset($_GET['action']) && $_GET['action'] === 'revoke_key') {
                $key_to_revoke = trim($_GET['key'] ?? '');
                if (array_key_exists($key_to_revoke, $ACCESS_KEYS)) {
                    unset($ACCESS_KEYS[$key_to_revoke]);
                    $keys_content = "<?php\n"
                                  . "if (!defined('SECURE_ACCESS')) die('Direct access forbidden');\n"
                                  . "\$MASTER_KEY = " . var_export($MASTER_KEY, true) . ";\n"
                                  . "\$ACCESS_KEYS = " . var_export($ACCESS_KEYS, true) . ";\n";
                    if (file_put_contents($keys_file, $keys_content)) {
                        $success_msg = "Access key revoked successfully.";
                    } else {
                        $error_msg = "Failed to update keys.";
                    }
                }
            }
            
        } catch (Exception $e) {
            $error_msg = "Upload Error: " . $e->getMessage();
        }
    }

        // Reload fresh data configuration for fields
        $json_data = json_decode(file_get_contents($data_file), true);
        
        $school = $json_data['school'] ?? [];
        $principal = $json_data['principal'] ?? [];
        $teachers = $json_data['teachers'] ?? [];
        $activities = $json_data['activities'] ?? [];
        $hostel = $json_data['hostel'] ?? [];
        $academics = $json_data['academics'] ?? [];
        $statistics = $json_data['statistics'] ?? [];
        $testimonials = $json_data['testimonials'] ?? [];
        $images = $json_data['images'] ?? [];
        $notices = $json_data['notices'] ?? [];
    } else {
        $error_msg = "Database file school-data.json not found.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>School CMS Dashboard - Govt HSS Excellence</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  
  <style>
    :root {
      --color-charcoal: #232B2B;
      --color-green: #0D5E3A;
      --color-green-light: #168a57;
      --color-gold: #D4AF37;
      --color-gold-light: #f3cb52;
      --color-bg-dark: #121616;
      --color-card-dark: #1a2020;
      --color-border-dark: #2c3636;
      --color-white: #ffffff;
      --color-gray-light: #f5f7f7;
      --color-text-muted: #839595;
      --font-family: 'Plus Jakarta Sans', sans-serif;
      --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
      --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.12);
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--color-bg-dark);
      color: var(--color-white);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.6;
      background-image: radial-gradient(circle at 10% 20%, rgba(13, 94, 58, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 45%);
    }

    header {
      background-color: var(--color-card-dark);
      border-bottom: 1px solid var(--color-border-dark);
      padding: 1.25rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-logo {
      width: 2.5rem;
      height: 2.5rem;
      background-color: rgba(212, 175, 55, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid var(--color-gold);
    }

    .brand-logo svg {
      width: 1.35rem;
      height: 1.35rem;
      fill: var(--color-gold);
    }

    .brand-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .role-badge {
      background-color: rgba(13, 94, 58, 0.2);
      border: 1px solid var(--color-green);
      color: #72ffb2;
      padding: 0.25rem 0.75rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .role-badge.master {
      background-color: rgba(212, 175, 55, 0.2);
      border: 1px solid var(--color-gold);
      color: var(--color-gold-light);
    }

    .btn-logout {
      background: transparent;
      border: 1px solid var(--color-border-dark);
      color: var(--color-white);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-logout:hover {
      background-color: rgba(255, 75, 75, 0.1);
      border-color: #ff4b4b;
      color: #ff4b4b;
    }

    .container {
      max-width: 1280px;
      width: 100%;
      margin: 2rem auto;
      padding: 0 1.5rem;
      flex-grow: 1;
    }

    /* Login Form */
    .login-wrapper {
      max-width: 420px;
      width: 100%;
      margin: 8vh auto auto auto;
    }

    .card {
      background-color: var(--color-card-dark);
      border: 1px solid var(--color-border-dark);
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--color-green), var(--color-gold));
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-align: center;
      letter-spacing: -0.02em;
    }

    .card-desc {
      color: var(--color-text-muted);
      font-size: 0.875rem;
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
      position: relative;
    }

    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--color-white);
    }

    .form-input {
      width: 100%;
      background-color: rgba(35, 43, 43, 0.4);
      border: 1.5px solid var(--color-border-dark);
      border-radius: 0.6rem;
      padding: 0.75rem 1.25rem;
      color: var(--color-white);
      font-family: var(--font-family);
      font-size: 0.95rem;
      transition: var(--transition);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--color-green);
      background-color: rgba(35, 43, 43, 0.6);
      box-shadow: 0 0 0 3px rgba(13, 94, 58, 0.25);
    }

    textarea.form-input {
      min-height: 120px;
      resize: vertical;
    }

    /* Helper for files */
    .file-input-wrapper {
      position: relative;
      margin-top: 0.25rem;
    }

    .current-image-preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 0.5rem;
      background-color: rgba(0, 0, 0, 0.2);
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid var(--color-border-dark);
    }

    .current-image-preview img {
      width: 50px;
      height: 35px;
      object-fit: cover;
      border-radius: 0.25rem;
      border: 1px solid #444;
    }

    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, var(--color-green) 0%, var(--color-green-light) 100%);
      color: var(--color-white);
      border: none;
      padding: 0.875rem;
      border-radius: 0.6rem;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(13, 94, 58, 0.3);
    }

    .btn-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(13, 94, 58, 0.45);
    }

    .btn-danger {
      background: #ff4b4b;
      color: #fff;
    }

    .btn-danger:hover {
      background: #e03b3b;
    }

    /* Notification Alerts */
    .alert {
      padding: 1rem 1.25rem;
      border-radius: 0.6rem;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideIn 0.3s ease-out;
    }

    .alert-error {
      background-color: rgba(255, 75, 75, 0.15);
      border: 1px solid rgba(255, 75, 75, 0.3);
      color: #ff7272;
    }

    .alert-success {
      background-color: rgba(13, 94, 58, 0.25);
      border: 1px solid rgba(13, 94, 58, 0.5);
      color: #72ffb2;
    }

    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* Dashboard Layout */
    .dashboard-layout {
      display: grid;
      grid-template-cols: 280px 1fr;
      gap: 2rem;
    }

    @media (max-width: 1200px) {
      .dashboard-layout {
        grid-template-cols: 240px 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .dashboard-layout {
        grid-template-cols: 1fr;
        gap: 1.5rem;
      }
      .sidebar {
        position: static !important;
        max-height: none !important;
      }
    }

    /* Sidebar Navigation */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: sticky;
      top: 6rem;
      align-self: start;
      max-height: calc(100vh - 8rem);
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .sidebar::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: var(--color-border-dark);
      border-radius: 2px;
    }

    .nav-tab {
      background-color: rgba(26, 32, 32, 0.6);
      border: 1px solid var(--color-border-dark);
      color: var(--color-text-muted);
      padding: 0.9rem 1.25rem;
      border-radius: 0.75rem;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.95rem;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .nav-tab:hover {
      color: var(--color-white);
      border-color: rgba(212, 175, 55, 0.4);
      background-color: rgba(13, 94, 58, 0.1);
      transform: translateX(4px);
    }

    .nav-tab.active {
      color: var(--color-white);
      border-color: var(--color-green);
      background-color: rgba(13, 94, 58, 0.25);
      box-shadow: inset 0 0 10px rgba(13, 94, 58, 0.2);
    }

    .nav-tab::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--color-green);
      transform: scaleY(0);
      transition: var(--transition);
    }

    .nav-tab.active::before {
      transform: scaleY(1);
    }

    .nav-tab-icon {
      width: 1.15rem;
      height: 1.15rem;
      fill: currentColor;
      flex-shrink: 0;
      transition: var(--transition);
    }

    /* Welcome Header in CMS */
    .dashboard-welcome {
      grid-column: span 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(13, 94, 58, 0.2) 0%, rgba(26, 32, 32, 0.6) 100%);
      border: 1px solid var(--color-border-dark);
      border-radius: 1rem;
      padding: 1.5rem 2rem;
      margin-bottom: 0.5rem;
      backdrop-filter: blur(10px);
    }

    @media (max-width: 768px) {
      .dashboard-welcome {
        grid-column: span 1;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    .welcome-text h1 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      background: linear-gradient(90deg, #fff, var(--color-gold-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .welcome-text p {
      font-size: 0.85rem;
      color: var(--color-text-muted);
    }

    .system-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #72ffb2;
      background: rgba(114, 255, 178, 0.1);
      padding: 0.4rem 0.8rem;
      border-radius: 2rem;
      border: 1px solid rgba(114, 255, 178, 0.2);
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      background-color: #52f396;
      border-radius: 50%;
      box-shadow: 0 0 8px #52f396;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(82, 243, 150, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(82, 243, 150, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(82, 243, 150, 0); }
    }

    /* Content Area */
    .content-area {
      background-color: var(--color-card-dark);
      border: 1px solid var(--color-border-dark);
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: var(--shadow-md);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .section-desc {
      color: var(--color-text-muted);
      font-size: 0.875rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--color-border-dark);
      padding-bottom: 1rem;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-cols: 1fr;
      }
    }

    .grid-full {
      grid-column: span 2;
    }

    @media (max-width: 600px) {
      .grid-full {
        grid-column: span 1;
      }
    }

    .form-section-header {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-gold);
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      border-bottom: 1px dashed var(--color-border-dark);
      padding-bottom: 0.25rem;
    }

    /* Manage Dynamic Lists */
    .list-manager-box {
      background-color: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--color-border-dark);
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .list-item-card {
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--color-border-dark);
      border-radius: 0.5rem;
      padding: 1rem 1.25rem;
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .list-item-info {
      flex-grow: 1;
    }

    .list-item-title {
      font-weight: 700;
      color: var(--color-white);
    }

    .list-item-subtitle {
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }

    .btn-icon-danger {
      background-color: rgba(255, 75, 75, 0.1);
      border: 1px solid rgba(255, 75, 75, 0.3);
      color: #ff7272;
      padding: 0.4rem 0.6rem;
      border-radius: 0.4rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.8rem;
      transition: var(--transition);
    }

    .btn-icon-danger:hover {
      background-color: #ff4b4b;
      color: #fff;
    }

    /* Dynamic Rules list */
    .rules-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .rule-row {
      display: flex;
      gap: 0.5rem;
    }

    .btn-secondary {
      background-color: rgba(212, 175, 55, 0.1);
      border: 1px solid var(--color-gold);
      color: var(--color-gold-light);
      padding: 0.75rem 1rem;
      border-radius: 0.6rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-secondary:hover {
      background-color: rgba(212, 175, 55, 0.2);
    }

    /* Keys Table */
    .key-table-wrapper {
      overflow-x: auto;
      border: 1px solid var(--color-border-dark);
      border-radius: 0.75rem;
    }

    .key-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }

    .key-table th {
      background-color: rgba(35, 43, 43, 0.5);
      color: var(--color-white);
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--color-border-dark);
    }

    .key-table td {
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--color-border-dark);
    }

    .key-code {
      font-family: monospace;
      background-color: rgba(255, 255, 255, 0.05);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      color: var(--color-gold-light);
    }

    footer {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-muted);
      font-size: 0.8rem;
      border-top: 1px solid var(--color-border-dark);
      background-color: var(--color-card-dark);
      margin-top: auto;
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM3.38 9L12 4.3 20.62 9 12 13.7 3.38 9zM12 17.5c-2.4 0-4.5-1.2-5.7-3.1L3.9 16c2 3.1 5.5 5 9.1 5s7.1-1.9 9.1-5l-2.4-1.6c-1.2 1.9-3.3 3.1-5.7 3.1z"/>
        </svg>
      </div>
      <div>
        <h1 class="brand-title">School CMS Hub</h1>
        <p class="brand-subtitle">Update Website Content & Settings</p>
      </div>
    </div>
    
    <?php if ($is_logged_in): ?>
      <div class="user-info">
        <span class="role-badge <?php echo $is_master ? 'master' : ''; ?>">
          <?php echo $is_master ? 'Master Access' : 'Staff Access'; ?>
        </span>
        <a href="admin.php?action=logout" class="btn-logout" onclick="localStorage.removeItem('admin_active_tab')">
          Logout
        </a>
      </div>
    <?php endif; ?>
  </header>

  <div class="container">
    
    <?php if (!$is_logged_in): ?>
      
      <!-- LOGIN VIEW -->
      <div class="login-wrapper">
        <div class="card">
          <h2 class="card-title">School CMS Login</h2>
          <p class="card-desc">Enter your access key to modify school content</p>
          
          <?php if (!empty($error_msg)): ?>
            <div class="alert alert-error">
              <?php echo htmlspecialchars($error_msg); ?>
            </div>
          <?php endif; ?>

          <form action="admin.php" method="POST">
            <input type="hidden" name="action" value="login" />
            <div class="form-group">
              <label for="access_key" class="form-label">Access Key</label>
              <input type="password" id="access_key" name="access_key" class="form-input" placeholder="••••••••••••••••" required />
            </div>
            <button type="submit" class="btn-submit">
              Access CMS Dashboard
            </button>
          </form>
        </div>
      </div>
      
    <?php else: ?>
      
      <!-- DASHBOARD VIEW -->
      
      <?php if (!empty($error_msg)): ?>
        <div class="alert alert-error">
          <?php echo htmlspecialchars($error_msg); ?>
        </div>
      <?php endif; ?>

      <?php if (!empty($success_msg)): ?>
        <div class="alert alert-success">
          <?php echo htmlspecialchars($success_msg); ?>
        </div>
      <?php endif; ?>

      <div class="dashboard-layout">
        
        <!-- Welcome Header Banner -->
        <div class="dashboard-welcome">
          <div class="welcome-text">
            <h1>Welcome back, <?php echo $is_master ? 'Master Admin' : 'Staff Editor'; ?></h1>
            <p>Manage and update your school website content instantly.</p>
          </div>
          <div class="system-status">
            <span class="status-indicator"></span>
            <span>CMS Active</span>
          </div>
        </div>

        <!-- Sidebar Navigation Tabs -->
        <div class="sidebar">
          <?php if ($is_master): ?>
            <button class="nav-tab <?php echo ($default_tab === 'general-tab') ? 'active' : ''; ?>" onclick="switchTab('general-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
              General & Stats
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'principal-tab') ? 'active' : ''; ?>" onclick="switchTab('principal-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              Principal Desk
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'contact-tab') ? 'active' : ''; ?>" onclick="switchTab('contact-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.58c0-.56-.45-1.04-1-.04z"/></svg>
              Contact Details
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'academics-tab') ? 'active' : ''; ?>" onclick="switchTab('academics-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.49 12.02L12 15.57l6.51-3.55-6.51-3.56-6.51 3.56z"/></svg>
              Academic Streams
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'activities-tab') ? 'active' : ''; ?>" onclick="switchTab('activities-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v1c0 2.44 1.72 4.48 4 4.9V15c0 2.21 1.79 4 4 4h1v2H9v2h6v-2h-4v-2h1c2.21 0 4-1.79 4-4V9.9c2.28-.42 4-2.46 4-4.9V4c0-1.1-.9-2-2-2zm-10 5c-1.1 0-2-.9-2-2V4h2v3zm10-2v2c0 1.1-.9 2-2 2V4h2z"/></svg>
              Activities & Sports
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'hostel-tab') ? 'active' : ''; ?>" onclick="switchTab('hostel-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              Hostel & Rules
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'notices-tab') ? 'active' : ''; ?>" onclick="switchTab('notices-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/></svg>
              Circulars & Notices
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'teachers-tab') ? 'active' : ''; ?>" onclick="switchTab('teachers-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              Faculty List
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'testimonials-tab') ? 'active' : ''; ?>" onclick="switchTab('testimonials-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7v-2h10v2zm0-3H7V9h10v2zm0-3H7V6h10v2z"/></svg>
              Reviews / Alumni
            </button>
            <button class="nav-tab <?php echo ($default_tab === 'keys-tab') ? 'active' : ''; ?>" style="border-color: var(--color-gold);" onclick="switchTab('keys-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24" style="fill: var(--color-gold);"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
              Manage Access Keys
            </button>
          <?php else: ?>
            <button class="nav-tab <?php echo ($default_tab === 'contact-tab') ? 'active' : ''; ?>" onclick="switchTab('contact-tab', this)">
              <svg class="nav-tab-icon" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.58c0-.56-.45-1.04-1-.04z"/></svg>
              Contact Details
            </button>
          <?php endif; ?>
        </div>
        
        <!-- Main Form Panel -->
        <div class="content-area">
          
          <!-- TAB 1: GENERAL INFO & STATS -->
          <?php if ($is_master): ?>
            <div id="general-tab" class="tab-content <?php echo ($default_tab === 'general-tab') ? 'active' : ''; ?>">
            <h2 class="section-title">General Settings & Statistics</h2>
            <p class="section-desc">Manage school name, medium, registration codes, hero image, and counters.</p>
            
            <form action="admin.php" method="POST" enctype="multipart/form-data">
              <input type="hidden" name="action" value="update_general" />
              <input type="hidden" name="active_tab" value="general-tab" />
              
              <div class="form-grid">
                <div class="form-group grid-full">
                  <label class="form-label" for="fullName">School Full Name</label>
                  <input type="text" id="fullName" name="fullName" class="form-input" value="<?php echo htmlspecialchars($school['fullName'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="shortName">Short Display Name</label>
                  <input type="text" id="shortName" name="shortName" class="form-input" value="<?php echo htmlspecialchars($school['shortName'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="establishedYear">Established Year</label>
                  <input type="number" id="establishedYear" name="establishedYear" class="form-input" value="<?php echo intval($school['establishedYear'] ?? 2002); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="type">School Type</label>
                  <input type="text" id="type" name="type" class="form-input" value="<?php echo htmlspecialchars($school['type'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="board">Affiliation Board</label>
                  <input type="text" id="board" name="board" class="form-input" value="<?php echo htmlspecialchars($school['board'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="udiseCode">UDISE Code</label>
                  <input type="text" id="udiseCode" name="udiseCode" class="form-input" value="<?php echo htmlspecialchars($school['udiseCode'] ?? ''); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="medium">Medium of Instruction</label>
                  <input type="text" id="medium" name="medium" class="form-input" value="<?php echo htmlspecialchars($school['medium'] ?? ''); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="grades">Classes / Grades Offered</label>
                  <input type="text" id="grades" name="grades" class="form-input" value="<?php echo htmlspecialchars($school['grades'] ?? ''); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="department">Department</label>
                  <input type="text" id="department" name="department" class="form-input" value="<?php echo htmlspecialchars($school['department'] ?? ''); ?>" />
                </div>
                
                <div class="form-group grid-full">
                  <label class="form-label" for="hero_img">Replace Hero Background Image</label>
                  <input type="file" id="hero_img" name="hero_img" class="form-input" accept="image/*" />
                  <div class="current-image-preview">
                    <img src="<?php echo htmlspecialchars($images['hero'] ?? ''); ?>" alt="Hero" />
                    <span>Current: <?php echo htmlspecialchars($images['hero'] ?? ''); ?></span>
                  </div>
                </div>
              </div>
              
              <h3 class="form-section-header">Statistics Numbers</h3>
              <div class="form-grid">
                <?php for ($i = 0; $i < 4; $i++): $stat = $statistics[$i] ?? ['value'=>0,'suffix'=>'','label'=>'']; ?>
                  <div class="form-group" style="grid-column: span 1">
                    <label class="form-label">Stat Card <?php echo $i+1; ?> Label</label>
                    <input type="text" name="stat_lab_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($stat['label']); ?>" required />
                  </div>
                  <div class="form-group" style="grid-column: span 1">
                    <label class="form-label">Stat Card <?php echo $i+1; ?> Value & Suffix</label>
                    <div style="display: flex; gap: 0.5rem;">
                      <input type="number" name="stat_val_<?php echo $i; ?>" class="form-input" style="width: 60%" value="<?php echo intval($stat['value']); ?>" required />
                      <input type="text" name="stat_suf_<?php echo $i; ?>" class="form-input" style="width: 40%" placeholder="e.g. +, %" value="<?php echo htmlspecialchars($stat['suffix']); ?>" />
                    </div>
                  </div>
                <?php endfor; ?>
              </div>
              
              <button type="submit" class="btn-submit">Save Settings & Stats</button>
            </form>
          </div>
          <?php endif; ?>
          
          <!-- TAB 2: PRINCIPAL MESSAGE -->
          <?php if ($is_master): ?>
            <div id="principal-tab" class="tab-content <?php echo ($default_tab === 'principal-tab') ? 'active' : ''; ?>">
              <h2 class="section-title">Principal Desk Settings</h2>
              <p class="section-desc">Edit details about the school principal, including credential, statement, vision, and profile picture.</p>
              
              <form action="admin.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="update_principal" />
                <input type="hidden" name="active_tab" value="principal-tab" />
                
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="p_name">Principal Name</label>
                    <input type="text" id="p_name" name="p_name" class="form-input" value="<?php echo htmlspecialchars($principal['name'] ?? ''); ?>" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="p_qual">Qualifications</label>
                    <input type="text" id="p_qual" name="p_qual" class="form-input" value="<?php echo htmlspecialchars($principal['qualification'] ?? ''); ?>" required />
                  </div>
                  <div class="form-group grid-full">
                    <label class="form-label" for="p_exp">Total Experience</label>
                    <input type="text" id="p_exp" name="p_exp" class="form-input" value="<?php echo htmlspecialchars($principal['experience'] ?? ''); ?>" />
                  </div>
                  
                  <div class="form-group grid-full">
                    <label class="form-label" for="principal_photo">Replace Principal Profile Photo</label>
                    <input type="file" id="principal_photo" name="principal_photo" class="form-input" accept="image/*" />
                    <div class="current-image-preview">
                      <img src="<?php echo htmlspecialchars($images['principal'] ?? ''); ?>" alt="Principal" />
                      <span>Current: <?php echo htmlspecialchars($images['principal'] ?? ''); ?></span>
                    </div>
                  </div>
  
                  <div class="form-group grid-full">
                    <label class="form-label" for="p_msg">From Principal's Desk (Full Statement Message)</label>
                    <textarea id="p_msg" name="p_msg" class="form-input" required><?php echo htmlspecialchars($principal['message'] ?? ''); ?></textarea>
                  </div>
                  <div class="form-group grid-full">
                    <label class="form-label" for="p_vision">School Vision</label>
                    <textarea id="p_vision" name="p_vision" class="form-input" required><?php echo htmlspecialchars($principal['vision'] ?? ''); ?></textarea>
                  </div>
                  <div class="form-group grid-full">
                    <label class="form-label" for="p_mission">School Mission</label>
                    <textarea id="p_mission" name="p_mission" class="form-input" required><?php echo htmlspecialchars($principal['mission'] ?? ''); ?></textarea>
                  </div>
                </div>
                
                <button type="submit" class="btn-submit">Save Principal Message</button>
              </form>
            </div>
          <?php endif; ?>
          
          <!-- TAB 3: CONTACT DETAILS -->
          <div id="contact-tab" class="tab-content <?php echo ($default_tab === 'contact-tab') ? 'active' : ''; ?>">
            <h2 class="section-title">Communication & Address Info</h2>
            <p class="section-desc">Edit contact channels, social networks, and postal coordinates.</p>
            
            <form action="admin.php" method="POST">
              <input type="hidden" name="action" value="update_contact" />
              <input type="hidden" name="active_tab" value="contact-tab" />
              
              <h3 class="form-section-header">Contact Channels</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="phone">Phone Number</label>
                  <input type="text" id="phone" name="phone" class="form-input" value="<?php echo htmlspecialchars($school['contact']['phone'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="email">Contact Form Email Receiver</label>
                  <input type="email" id="email" name="email" class="form-input" value="<?php echo htmlspecialchars($school['contact']['email'] ?? ''); ?>" required />
                </div>
                <div class="form-group grid-full">
                  <label class="form-label" for="officeHours">Visiting/Office Hours</label>
                  <input type="text" id="officeHours" name="officeHours" class="form-input" value="<?php echo htmlspecialchars($school['contact']['officeHours'] ?? ''); ?>" required />
                </div>
              </div>

              <h3 class="form-section-header">Location Details</h3>
              <div class="form-grid">
                <div class="form-group grid-full">
                  <label class="form-label" for="street">Street Line</label>
                  <input type="text" id="street" name="street" class="form-input" value="<?php echo htmlspecialchars($school['address']['street'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="area">Area / Locality</label>
                  <input type="text" id="area" name="area" class="form-input" value="<?php echo htmlspecialchars($school['address']['area'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="city">City</label>
                  <input type="text" id="city" name="city" class="form-input" value="<?php echo htmlspecialchars($school['address']['city'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="state">State</label>
                  <input type="text" id="state" name="state" class="form-input" value="<?php echo htmlspecialchars($school['address']['state'] ?? ''); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="pincode">Pincode</label>
                  <input type="text" id="pincode" name="pincode" class="form-input" value="<?php echo htmlspecialchars($school['address']['pincode'] ?? ''); ?>" required />
                </div>
              </div>

              <h3 class="form-section-header">Social Media URLs</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="facebook">Facebook Link</label>
                  <input type="url" id="facebook" name="facebook" class="form-input" value="<?php echo htmlspecialchars($school['social']['facebook'] ?? ''); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="instagram">Instagram Link</label>
                  <input type="url" id="instagram" name="instagram" class="form-input" value="<?php echo htmlspecialchars($school['social']['instagram'] ?? ''); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="linkedin">LinkedIn Link</label>
                  <input type="url" id="linkedin" name="linkedin" class="form-input" value="<?php echo htmlspecialchars($school['social']['linkedin'] ?? ''); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="youtube">YouTube Video Link</label>
                  <input type="url" id="youtube" name="youtube" class="form-input" value="<?php echo htmlspecialchars($school['social']['youtube'] ?? ''); ?>" />
                </div>
              </div>

              <button type="submit" class="btn-submit">Save Contact Details</button>
            </form>
          </div>
          
          <!-- TAB 4: ACADEMIC DETAILS -->
          <?php if ($is_master): ?>
            <div id="academics-tab" class="tab-content <?php echo ($default_tab === 'academics-tab') ? 'active' : ''; ?>">
              <h2 class="section-title">Academic Streams & Facilities</h2>
              <p class="section-desc">Manage your course curriculum, active academic streams, and educational facility cards.</p>
              
              <form action="admin.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="update_academics" />
                <input type="hidden" name="active_tab" value="academics-tab" />
                
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="a_curr">Curriculum Board</label>
                    <input type="text" id="a_curr" name="a_curr" class="form-input" value="<?php echo htmlspecialchars($academics['curriculum'] ?? ''); ?>" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="a_streams">Academic Streams Offered (Comma separated)</label>
                    <input type="text" id="a_streams" name="a_streams" class="form-input" value="<?php echo htmlspecialchars(implode(', ', $academics['streams'] ?? [])); ?>" required />
                  </div>
                  <div class="form-group grid-full">
                    <label class="form-label" for="a_desc">Academics Section Overview Description</label>
                    <textarea id="a_desc" name="a_desc" class="form-input" required><?php echo htmlspecialchars($academics['description'] ?? ''); ?></textarea>
                  </div>
                </div>
  
                <!-- Academic Facilities loop -->
                <?php for ($i = 0; $i < 3; $i++): $fac = $academics['facilities'][$i] ?? ['title'=>'','description'=>'','image'=>'']; ?>
                  <h3 class="form-section-header">Academic Facility Card <?php echo $i+1; ?></h3>
                  <div class="form-grid">
                    <div class="form-group grid-full">
                      <label class="form-label">Facility Title</label>
                      <input type="text" name="fac_title_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($fac['title']); ?>" required />
                    </div>
                    <div class="form-group grid-full">
                      <label class="form-label">Facility Description</label>
                      <textarea name="fac_desc_<?php echo $i; ?>" class="form-input" required><?php echo htmlspecialchars($fac['description']); ?></textarea>
                    </div>
                    <div class="form-group grid-full">
                      <label class="form-label">Replace Facility Image</label>
                      <input type="file" name="fac_img_<?php echo $i; ?>" class="form-input" accept="image/*" />
                      <div class="current-image-preview">
                        <img src="<?php echo htmlspecialchars($fac['image']); ?>" alt="Facility" />
                        <span>Current: <?php echo htmlspecialchars($fac['image']); ?></span>
                      </div>
                    </div>
                  </div>
                <?php endfor; ?>
                
                <button type="submit" class="btn-submit">Save Academic Details</button>
              </form>
            </div>
          <?php endif; ?>
          
          <!-- TAB 5: SPORTS & ACTIVITIES -->
          <?php if ($is_master): ?>
            <div id="activities-tab" class="tab-content <?php echo ($default_tab === 'activities-tab') ? 'active' : ''; ?>">
              <h2 class="section-title">Sports & Extracurricular Activities</h2>
              <p class="section-desc">Edit training descriptions, facilities, and replacement photos for sport and activity programs.</p>
              
              <form action="admin.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="update_activities" />
                <input type="hidden" name="active_tab" value="activities-tab" />
                
                <!-- Featured Activities Loop (Badminton, Boxing, Cricket) -->
                <?php for ($i = 0; $i < 3; $i++): $act = $activities['featured'][$i] ?? ['title'=>'','description'=>'','facilities'=>'','coaching'=>'','achievements'=>'','schedule'=>'','image'=>'']; ?>
                  <h3 class="form-section-header">Featured Sport: <?php echo htmlspecialchars($act['title']); ?></h3>
                  <div class="form-grid">
                    <div class="form-group grid-full">
                      <label class="form-label">Overview Description</label>
                      <textarea name="act_desc_<?php echo $i; ?>" class="form-input" required><?php echo htmlspecialchars($act['description']); ?></textarea>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Court / Ring / Pitch Facilities</label>
                      <input type="text" name="act_fac_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($act['facilities']); ?>" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Coaching Details</label>
                      <input type="text" name="act_coach_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($act['coaching']); ?>" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Key Sport Achievements</label>
                      <input type="text" name="act_ach_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($act['achievements']); ?>" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Training Schedule</label>
                      <input type="text" name="act_sched_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($act['schedule']); ?>" required />
                    </div>
                    <div class="form-group grid-full">
                      <label class="form-label">Replace Sport Image</label>
                      <input type="file" name="act_img_<?php echo $i; ?>" class="form-input" accept="image/*" />
                      <div class="current-image-preview">
                        <img src="<?php echo htmlspecialchars($act['image']); ?>" alt="Sport" />
                        <span>Current: <?php echo htmlspecialchars($act['image']); ?></span>
                      </div>
                    </div>
                  </div>
                <?php endfor; ?>
  
                <!-- Other Activities Descriptions -->
                <h3 class="form-section-header">Other Activities (Quick descriptions)</h3>
                <div class="form-grid">
                  <?php for ($i = 0; $i < 6; $i++): $oth = $activities['other'][$i] ?? ['title'=>'','description'=>'']; ?>
                    <div class="form-group grid-full">
                      <label class="form-label"><?php echo htmlspecialchars($oth['title']); ?> Description</label>
                      <textarea name="other_act_desc_<?php echo $i; ?>" class="form-input" style="min-height: 70px" required><?php echo htmlspecialchars($oth['description']); ?></textarea>
                    </div>
                  <?php endfor; ?>
                </div>
                
                <button type="submit" class="btn-submit">Save Activities Details</button>
              </form>
            </div>
          <?php endif; ?>
          
          <!-- TAB 6: HOSTEL & RULES -->
          <?php if ($is_master): ?>
            <div id="hostel-tab" class="tab-content <?php echo ($default_tab === 'hostel-tab') ? 'active' : ''; ?>">
              <h2 class="section-title">Hostel, Mess & Safety Rules</h2>
              <p class="section-desc">Manage boarding capacity, wardens contact info, features, and regulatory guidelines.</p>
              
              <form action="admin.php" method="POST">
                <input type="hidden" name="action" value="update_hostel" />
                <input type="hidden" name="active_tab" value="hostel-tab" />
                
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="h_capacity">Hostel Boarding Capacity</label>
                    <input type="number" id="h_capacity" name="h_capacity" class="form-input" value="<?php echo intval($hostel['capacity'] ?? 100); ?>" required />
                  </div>
                  <div class="form-group grid-full">
                    <label class="form-label" for="h_overview">Hostel overview text</label>
                    <textarea id="h_overview" name="h_overview" class="form-input" required><?php echo htmlspecialchars($hostel['overview'] ?? ''); ?></textarea>
                  </div>
                </div>
  
                <!-- Wardens -->
                <?php for ($i = 0; $i < 2; $i++): $war = $hostel['wardens'][$i] ?? ['name'=>'','designation'=>'','phone'=>'']; ?>
                  <h3 class="form-section-header">Hostel Warden <?php echo $i+1; ?> Details</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Warden Name</label>
                      <input type="text" name="w_name_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($war['name']); ?>" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Designation / Rank</label>
                      <input type="text" name="w_desg_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($war['designation']); ?>" required />
                    </div>
                    <div class="form-group grid-full">
                      <label class="form-label">Contact Phone</label>
                      <input type="text" name="w_phone_<?php echo $i; ?>" class="form-input" value="<?php echo htmlspecialchars($war['phone']); ?>" required />
                    </div>
                  </div>
                <?php endfor; ?>
  
                <!-- Rules Management -->
                <h3 class="form-section-header">Hostel Rules & Regulations</h3>
                <p class="generator-desc" style="margin-top: -0.5rem; margin-bottom: 1rem;">Add or remove boarding rules. Empty lines are automatically ignored.</p>
                
                <div class="rules-container" id="rules-box">
                  <?php foreach (($hostel['rules'] ?? []) as $r): ?>
                    <div class="rule-row">
                      <input type="text" name="h_rules[]" class="form-input" value="<?php echo htmlspecialchars($r); ?>" />
                      <button type="button" class="btn-icon-danger" onclick="this.parentElement.remove()">Remove</button>
                    </div>
                  <?php endforeach; ?>
                </div>
                <button type="button" class="btn-secondary" style="margin-bottom: 2rem;" onclick="addNewRuleRow()">+ Add New Rule</button>
                
                <button type="submit" class="btn-submit">Save Hostel Details & Rules</button>
              </form>
            </div>
          <?php endif; ?>
          
          <!-- TAB 7: CIRCULARS & NOTICES -->
          <?php if ($is_master): ?>
            <div id="notices-tab" class="tab-content <?php echo ($default_tab === 'notices-tab') ? 'active' : ''; ?>">
            <h2 class="section-title">School Circulars & Notices</h2>
            <p class="section-desc">Broadcast official updates, schedules, timetables, and academic circulars to students.</p>
            
            <!-- List current notices -->
            <h3 class="form-section-header">Active Circulars & Notices</h3>
            <div class="list-manager-box">
              <?php if (empty($notices)): ?>
                <p style="color: var(--color-text-muted); text-align: center;">No active circulars or notices posted.</p>
              <?php else: ?>
                <?php foreach ($notices as $n): ?>
                  <div class="list-item-card">
                    <div class="list-item-info">
                      <div class="list-item-title">
                        <?php echo htmlspecialchars($n['title']); ?>
                        <?php if (!empty($n['important'])): ?><span class="role-badge" style="font-size:0.65rem; padding: 0.1rem 0.4rem; background:rgba(255,75,75,0.1); border-color:#ff4b4b; color:#ff7272; margin-left:0.5rem">Important</span><?php endif; ?>
                      </div>
                      <div class="list-item-subtitle"><?php echo htmlspecialchars($n['date']); ?> — <?php echo htmlspecialchars($n['description'] ?? ''); ?></div>
                    </div>
                    <a href="admin.php?action=delete_notice&id=<?php echo $n['id']; ?>&active_tab=notices-tab" class="btn-icon-danger" onclick="return confirm('Are you sure you want to delete this notice?');">Delete</a>
                  </div>
                <?php endforeach; ?>
              <?php endif; ?>
            </div>

            <!-- Add new notice -->
            <div class="key-generator-box">
              <h3 class="generator-title">Publish New Circular / Notice</h3>
              <form action="admin.php" method="POST">
                <input type="hidden" name="action" value="add_notice" />
                <input type="hidden" name="active_tab" value="notices-tab" />
                <div class="form-grid">
                  <div class="form-group grid-full">
                    <label class="form-label" for="n_title">Title (Circular/Notice)</label>
                    <input type="text" id="n_title" name="n_title" class="form-input" placeholder="e.g. Quarterly Exam Schedule 2026 or Admission open notice" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="n_date">Posting Date</label>
                    <input type="text" id="n_date" name="n_date" class="form-input" value="<?php echo date('M d, Y'); ?>" required />
                  </div>
                  <div class="form-group" style="display:flex; align-items:center; height:100%; margin-bottom:0; padding-top:1.5rem">
                    <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                      <input type="checkbox" id="n_important" name="n_important" style="width: 18px; height: 18px;" />
                      <span class="form-label" style="margin-bottom:0">Mark as Critical / Important</span>
                    </label>
                  </div>
                  <div class="form-group grid-full">
                    <label class="form-label" for="n_desc">Body Description / Content</label>
                    <textarea id="n_desc" name="n_desc" class="form-input" placeholder="Enter notice/circular body text..." required></textarea>
                  </div>
                </div>
                <button type="submit" class="btn-submit">Publish Circular & Notice</button>
              </form>
            </div>
          </div>
        <?php endif; ?>
          
          <!-- TAB 8: FACULTY LIST -->
          <?php if ($is_master): ?>
            <div id="teachers-tab" class="tab-content <?php echo ($default_tab === 'teachers-tab') ? 'active' : ''; ?>">
            <h2 class="section-title">Manage Faculty & Teachers</h2>
            <p class="section-desc">Add or remove teachers, administrative coordinators, and coaches from the website profile directory.</p>
            
            <!-- List current teachers -->
            <h3 class="form-section-header">Current Faculty Members</h3>
            <div class="list-manager-box">
              <?php if (empty($teachers)): ?>
                <p style="color: var(--color-text-muted); text-align: center;">No teachers registered in the list.</p>
              <?php else: ?>
                <?php foreach ($teachers as $t): ?>
                  <div class="list-item-card">
                    <div class="list-item-info">
                      <div class="list-item-title"><?php echo htmlspecialchars($t['name']); ?></div>
                      <div class="list-item-subtitle"><?php echo htmlspecialchars($t['designation']); ?> (<?php echo htmlspecialchars($t['subject']); ?>) — <?php echo htmlspecialchars($t['experience']); ?> Exp</div>
                    </div>
                    <a href="admin.php?action=delete_teacher&id=<?php echo $t['id']; ?>&active_tab=teachers-tab" class="btn-icon-danger" onclick="return confirm('Are you sure you want to remove this faculty member?');">Remove</a>
                  </div>
                <?php endforeach; ?>
              <?php endif; ?>
            </div>

            <!-- Add new teacher -->
            <div class="key-generator-box">
              <h3 class="generator-title">Add Faculty Member</h3>
              <form action="admin.php" method="POST">
                <input type="hidden" name="action" value="add_teacher" />
                <input type="hidden" name="active_tab" value="teachers-tab" />
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="t_name">Teacher Name</label>
                    <input type="text" id="t_name" name="t_name" class="form-input" placeholder="e.g. Smt. Preeti Jain" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="t_desg">Designation</label>
                    <input type="text" id="t_desg" name="t_desg" class="form-input" placeholder="e.g. HOD Mathematics" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="t_qual">Academic Credentials</label>
                    <input type="text" id="t_qual" name="t_qual" class="form-input" placeholder="e.g. M.Sc. (Maths), B.Ed." required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="t_sub">Primary Subject taught</label>
                    <input type="text" id="t_sub" name="t_sub" class="form-input" placeholder="e.g. Mathematics" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="t_exp">Teaching Experience</label>
                    <input type="text" id="t_exp" name="t_exp" class="form-input" placeholder="e.g. 18 years" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="t_role">Special Role / In-charge</label>
                    <input type="text" id="t_role" name="t_role" class="form-input" placeholder="e.g. Math Lab Coordinator" />
                  </div>
                </div>
                <button type="submit" class="btn-submit">Register Faculty Member</button>
              </form>
            </div>
          </div>
        <?php endif; ?>
          
          <!-- TAB 9: TESTIMONIALS -->
          <?php if ($is_master): ?>
            <div id="testimonials-tab" class="tab-content <?php echo ($default_tab === 'testimonials-tab') ? 'active' : ''; ?>">
            <h2 class="section-title">Manage Reviews & Alumni Feedback</h2>
            <p class="section-desc">Broadcast parent comments, student achievements, and alumni feedback.</p>
            
            <!-- List current testimonials -->
            <h3 class="form-section-header">Active Website Reviews</h3>
            <div class="list-manager-box">
              <?php if (empty($testimonials)): ?>
                <p style="color: var(--color-text-muted); text-align: center;">No testimonials loaded on the site.</p>
              <?php else: ?>
                <?php foreach ($testimonials as $idx => $tst): ?>
                  <div class="list-item-card">
                    <div class="list-item-info">
                      <div class="list-item-title"><?php echo htmlspecialchars($tst['name']); ?> (<?php echo htmlspecialchars($tst['role']); ?>) — <?php echo str_repeat('★', intval($tst['stars'])); ?></div>
                      <div class="list-item-subtitle">"<?php echo htmlspecialchars($tst['quote']); ?>"</div>
                    </div>
                    <a href="admin.php?action=delete_testimonial&idx=<?php echo $idx; ?>&active_tab=testimonials-tab" class="btn-icon-danger" onclick="return confirm('Are you sure you want to remove this review?');">Delete</a>
                  </div>
                <?php endforeach; ?>
              <?php endif; ?>
            </div>

            <!-- Add new testimonial -->
            <div class="key-generator-box">
              <h3 class="generator-title">Add Website Review</h3>
              <form action="admin.php" method="POST">
                <input type="hidden" name="action" value="add_testimonial" />
                <input type="hidden" name="active_tab" value="testimonials-tab" />
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="tst_name">Reviewer Name</label>
                    <input type="text" id="tst_name" name="tst_name" class="form-input" placeholder="e.g. Rajesh Kumar Verma" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="tst_role">Relationship / Role</label>
                    <input type="text" id="tst_role" name="tst_role" class="form-input" placeholder="e.g. Parent, Class XII Alumni" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="tst_stars">Rating Stars (1-5)</label>
                    <select id="tst_stars" name="tst_stars" class="form-input">
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                    </select>
                  </div>
                  <div class="form-group grid-full">
                    <label class="form-label" for="tst_quote">Review Quote Statement</label>
                    <textarea id="tst_quote" name="tst_quote" class="form-input" placeholder="Enter student/parent review feedback quote..." required></textarea>
                  </div>
                </div>
                <button type="submit" class="btn-submit">Submit Website Review</button>
              </form>
            </div>
          </div>
        <?php endif; ?>
          
          <?php if ($is_master): ?>
            <!-- TAB 10: ACCESS KEYS (Master Only) -->
            <div id="keys-tab" class="tab-content <?php echo ($default_tab === 'keys-tab') ? 'active' : ''; ?>">
              <h2 class="section-title">Manage CMS Access Keys</h2>
              <p class="section-desc">Generate secure keys for staff editors, or revoke keys to lock access instantly.</p>
              
              <!-- Generator -->
              <div class="key-generator-box">
                <h3 class="generator-title">Generate Staff Key</h3>
                <form action="admin.php" method="POST">
                  <input type="hidden" name="action" value="add_key" />
                  <input type="hidden" name="active_tab" value="keys-tab" />
                  <div class="gen-actions">
                    <div class="form-group" style="flex-grow: 1; margin-bottom: 0;">
                      <label class="form-label" for="new_label">Key Label / Owner Name</label>
                      <input type="text" id="new_label" name="new_label" class="form-input" placeholder="e.g. Science Lab Staff" required />
                    </div>
                    <div class="form-group" style="flex-grow: 1; margin-bottom: 0;">
                      <label class="form-label" for="new_key">Access Key Code</label>
                      <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="new_key" name="new_key" class="form-input" placeholder="e.g. excellence_staff_402" required />
                        <button type="button" class="btn-secondary" onclick="generateRandomKey()">Generate Code</button>
                      </div>
                    </div>
                    <button type="submit" class="btn-submit" style="width: auto; height: 42px; padding: 0 1.5rem; white-space: nowrap; box-shadow: none;">
                      Save Key
                    </button>
                  </div>
                </form>
              </div>
              
              <!-- Key List Table -->
              <h3 class="form-section-header">Active Access Keys</h3>
              <div class="key-table-wrapper">
                <table class="key-table">
                  <thead>
                    <tr>
                      <th>Key Owner Label</th>
                      <th>Key Code</th>
                      <th style="width: 120px; text-align: right;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>MASTER ADMIN KEY</strong> (Self)</td>
                      <td><span class="key-code" style="color: #bbb; filter: blur(3px); transition: 0.3s; cursor: pointer;" onclick="this.style.filter='none'">excellence_master_2026</span></td>
                      <td style="text-align: right;"><span style="font-size: 0.8rem; color: var(--color-gold); font-weight: bold;">System Key</span></td>
                    </tr>
                    <?php if (empty($ACCESS_KEYS)): ?>
                      <tr>
                        <td colspan="3" style="text-align: center; color: var(--color-text-muted); padding: 1.5rem;">No staff keys active. Generate one above!</td>
                      </tr>
                    <?php else: ?>
                      <?php foreach ($ACCESS_KEYS as $k => $label): ?>
                        <tr>
                          <td><?php echo htmlspecialchars($label); ?></td>
                          <td><span class="key-code"><?php echo htmlspecialchars($k); ?></span></td>
                          <td style="text-align: right;">
                            <a href="admin.php?action=revoke_key&key=<?php echo urlencode($k); ?>&active_tab=keys-tab" class="btn-revoke" onclick="return confirm('Are you sure you want to revoke access?');">
                              Revoke
                            </a>
                          </td>
                        </tr>
                      <?php endforeach; ?>
                    <?php endif; ?>
                  </tbody>
                </table>
              </div>
            </div>
          <?php endif; ?>

        </div>
        
      </div>
      
    <?php endif; ?>
    
  </div>

  <footer>
    <p>© <?php echo date('Y'); ?> Govt. Higher Secondary School for Excellence, Bhopal. All rights reserved.</p>
  </footer>

  <script>
    function switchTab(tabId, el) {
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      const targetTab = document.getElementById(tabId);
      if (targetTab) {
        targetTab.classList.add('active');
      }
      
      document.querySelectorAll('.nav-tab').forEach(item => {
        item.classList.remove('active');
      });
      if (el) {
        el.classList.add('active');
      }
      
      // Persist active tab across page reloads
      localStorage.setItem('admin_active_tab', tabId);
    }
    
    // Restore active tab on load
    window.addEventListener('DOMContentLoaded', () => {
      const savedTab = localStorage.getItem('admin_active_tab');
      if (savedTab) {
        const tabButton = Array.from(document.querySelectorAll('.nav-tab')).find(btn => {
          const onclickAttr = btn.getAttribute('onclick');
          return onclickAttr && onclickAttr.includes(savedTab);
        });
        if (tabButton) {
          switchTab(savedTab, tabButton);
        }
      }
    });
    
    function generateRandomKey() {
      const rand = Math.floor(100 + Math.random() * 900);
      document.getElementById('new_key').value = 'excellence_staff_' + rand;
    }

    function addNewRuleRow() {
      const box = document.getElementById('rules-box');
      const div = document.createElement('div');
      div.className = 'rule-row';
      div.innerHTML = `
        <input type="text" name="h_rules[]" class="form-input" placeholder="Type hostel rule statement..." />
        <button type="button" class="btn-icon-danger" onclick="this.parentElement.remove()">Remove</button>
      `;
      box.appendChild(div);
      div.querySelector('input').focus();
    }
  </script>
</body>
</html>

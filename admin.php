<?php
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

// Handle Logged In Actions
if ($is_logged_in) {
    $data_file = __DIR__ . '/data/school-data.json';
    $js_file = __DIR__ . '/js/data.js';

    // 1. Update Contact Information
    if (isset($_POST['action']) && $_POST['action'] === 'update_contact') {
        if (file_exists($data_file)) {
            $json_data = json_decode(file_get_contents($data_file), true);

            // Update contact details
            $json_data['school']['contact']['phone'] = trim($_POST['phone'] ?? '');
            $json_data['school']['contact']['email'] = trim($_POST['email'] ?? '');
            $json_data['school']['contact']['officeHours'] = trim($_POST['officeHours'] ?? '');

            // Update address details
            $json_data['school']['address']['street'] = trim($_POST['street'] ?? '');
            $json_data['school']['address']['area'] = trim($_POST['area'] ?? '');
            $json_data['school']['address']['city'] = trim($_POST['city'] ?? '');
            $json_data['school']['address']['state'] = trim($_POST['state'] ?? '');
            $json_data['school']['address']['pincode'] = trim($_POST['pincode'] ?? '');

            // Update social media links
            $json_data['school']['social']['facebook'] = trim($_POST['facebook'] ?? '');
            $json_data['school']['social']['instagram'] = trim($_POST['instagram'] ?? '');
            $json_data['school']['social']['linkedin'] = trim($_POST['linkedin'] ?? '');
            $json_data['school']['social']['youtube'] = trim($_POST['youtube'] ?? '');

            // Save JSON file
            $new_json = json_encode($json_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if (file_put_contents($data_file, $new_json)) {
                // Save JS file to keep them in sync
                $new_js = "window.schoolData = " . $new_json . ";\n";
                file_put_contents($js_file, $new_js);
                $success_msg = "Contact information updated successfully!";
            } else {
                $error_msg = "Failed to write updates to data files. Check file permissions.";
            }
        } else {
            $error_msg = "Database file school-data.json not found.";
        }
    }

    // 2. Add New Access Key (Master Only)
    if ($is_master && isset($_POST['action']) && $_POST['action'] === 'add_key') {
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
                $error_msg = "Failed to save the new key. Check file permissions on data/keys.php.";
            }
        }
    }

    // 3. Revoke/Delete Access Key (Master Only)
    if ($is_master && isset($_GET['action']) && $_GET['action'] === 'revoke_key') {
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
                $error_msg = "Failed to update keys. Check file permissions on data/keys.php.";
            }
        } else {
            $error_msg = "Key not found or could not be revoked.";
        }
    }

    // Load dynamic data for forms
    $contact = ['phone' => '', 'email' => '', 'officeHours' => ''];
    $address = ['street' => '', 'area' => '', 'city' => '', 'state' => '', 'pincode' => ''];
    $social = ['facebook' => '', 'instagram' => '', 'linkedin' => '', 'youtube' => ''];

    if (file_exists($data_file)) {
        $json_data = json_decode(file_get_contents($data_file), true);
        $contact = array_merge($contact, $json_data['school']['contact'] ?? []);
        $address = array_merge($address, $json_data['school']['address'] ?? []);
        $social = array_merge($social, $json_data['school']['social'] ?? []);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>School Admin Dashboard - Govt HSS Excellence</title>
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

    /* Header styling */
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

    /* Main Container layout */
    .container {
      max-width: 1200px;
      width: 100%;
      margin: 2rem auto;
      padding: 0 1.5rem;
      flex-grow: 1;
    }

    /* Login Form styling */
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
      letter-spacing: 0.01em;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      pointer-events: none;
    }

    .input-icon svg {
      width: 1.2rem;
      height: 1.2rem;
    }

    .form-input {
      width: 100%;
      background-color: rgba(35, 43, 43, 0.4);
      border: 1.5px solid var(--color-border-dark);
      border-radius: 0.6rem;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
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
      background: linear-gradient(135deg, var(--color-green-light) 0%, var(--color-green) 100%);
    }

    .btn-submit:active {
      transform: translateY(0);
    }

    /* Notification Alert styling */
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

    /* Dashboard Layout styling */
    .dashboard-layout {
      display: grid;
      grid-template-cols: 280px 1fr;
      gap: 2rem;
    }

    @media (max-width: 900px) {
      .dashboard-layout {
        grid-template-cols: 1fr;
      }
    }

    /* Sidebar Navigation */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .nav-tab {
      background-color: var(--color-card-dark);
      border: 1px solid var(--color-border-dark);
      color: var(--color-text-muted);
      padding: 1rem 1.25rem;
      border-radius: 0.75rem;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav-tab:hover {
      color: var(--color-white);
      border-color: rgba(13, 94, 58, 0.5);
      background-color: rgba(13, 94, 58, 0.05);
    }

    .nav-tab.active {
      color: var(--color-white);
      border-color: var(--color-green);
      background-color: rgba(13, 94, 58, 0.15);
      position: relative;
    }

    .nav-tab.active::after {
      content: '';
      position: absolute;
      right: 1.25rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--color-gold);
    }

    /* Content Area styling */
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
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--color-gold);
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Access Key Management Panel */
    .key-generator-box {
      background-color: rgba(212, 175, 55, 0.05);
      border: 1px dashed var(--color-gold);
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .generator-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-gold-light);
      margin-bottom: 0.5rem;
    }

    .generator-desc {
      color: var(--color-text-muted);
      font-size: 0.825rem;
      margin-bottom: 1.25rem;
    }

    .gen-actions {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }

    @media (max-width: 600px) {
      .gen-actions {
        flex-direction: column;
        align-items: stretch;
      }
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
      white-space: nowrap;
    }

    .btn-secondary:hover {
      background-color: rgba(212, 175, 55, 0.2);
      transform: translateY(-1px);
    }

    /* Key List Table styling */
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
      font-weight: 700;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--color-border-dark);
    }

    .key-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border-dark);
      vertical-align: middle;
    }

    .key-table tr:last-child td {
      border-bottom: none;
    }

    .key-code {
      font-family: monospace;
      background-color: rgba(255, 255, 255, 0.05);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      color: var(--color-gold-light);
    }

    .btn-revoke {
      background-color: rgba(255, 75, 75, 0.15);
      border: 1px solid rgba(255, 75, 75, 0.3);
      color: #ff7272;
      padding: 0.4rem 0.8rem;
      border-radius: 0.4rem;
      font-size: 0.8rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .btn-revoke:hover {
      background-color: #ff4b4b;
      color: var(--color-white);
      border-color: #ff4b4b;
    }

    /* Footer */
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

  <!-- Header -->
  <header>
    <div class="brand">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM3.38 9L12 4.3 20.62 9 12 13.7 3.38 9zM12 17.5c-2.4 0-4.5-1.2-5.7-3.1L3.9 16c2 3.1 5.5 5 9.1 5s7.1-1.9 9.1-5l-2.4-1.6c-1.2 1.9-3.3 3.1-5.7 3.1z"/>
        </svg>
      </div>
      <div>
        <h1 class="brand-title">Govt. HSS Excellence</h1>
        <p class="brand-subtitle">School Administration Hub</p>
      </div>
    </div>
    
    <?php if ($is_logged_in): ?>
      <div class="user-info">
        <span class="role-badge <?php echo $is_master ? 'master' : ''; ?>">
          <?php echo $is_master ? 'Master Access' : 'Staff Access'; ?>
        </span>
        <a href="admin.php?action=logout" class="btn-logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
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
          <h2 class="card-title">Access Administration</h2>
          <p class="card-desc">Please enter your access key to manage details</p>
          
          <?php if (!empty($error_msg)): ?>
            <div class="alert alert-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <?php echo htmlspecialchars($error_msg); ?>
            </div>
          <?php endif; ?>

          <form action="admin.php" method="POST">
            <input type="hidden" name="action" value="login" />
            <div class="form-group">
              <label for="access_key" class="form-label">Access Key</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input type="password" id="access_key" name="access_key" class="form-input" placeholder="••••••••••••••••" required />
              </div>
            </div>
            <button type="submit" class="btn-submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
      
    <?php else: ?>
      
      <!-- DASHBOARD VIEW -->
      
      <?php if (!empty($error_msg)): ?>
        <div class="alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <?php echo htmlspecialchars($error_msg); ?>
        </div>
      <?php endif; ?>

      <?php if (!empty($success_msg)): ?>
        <div class="alert alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <?php echo htmlspecialchars($success_msg); ?>
        </div>
      <?php endif; ?>

      <div class="dashboard-layout">
        
        <!-- Sidebar Tabs -->
        <div class="sidebar">
          <button class="nav-tab active" onclick="switchTab('contact-tab', this)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Contact Info
          </button>
          
          <?php if ($is_master): ?>
            <button class="nav-tab" onclick="switchTab('keys-tab', this)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L20 4m0 0h2v2"></path></svg>
              Manage Access Keys
            </button>
          <?php endif; ?>
        </div>
        
        <!-- Main Content Panel -->
        <div class="content-area">
          
          <!-- TAB 1: CONTACT INFO -->
          <div id="contact-tab" class="tab-content active">
            <h2 class="section-title">Update Contact & Location Details</h2>
            <p class="section-desc">Change the contact details displayed across the website footer and contact page.</p>
            
            <form action="admin.php" method="POST">
              <input type="hidden" name="action" value="update_contact" />
              
              <!-- Contact Details Section -->
              <h3 class="form-section-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Communication Details
              </h3>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="phone">Phone Number</label>
                  <input type="text" id="phone" name="phone" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($contact['phone']); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="email">Email Address</label>
                  <input type="email" id="email" name="email" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($contact['email']); ?>" required />
                </div>
                <div class="form-group grid-full">
                  <label class="form-label" for="officeHours">Office / Visiting Hours</label>
                  <input type="text" id="officeHours" name="officeHours" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($contact['officeHours']); ?>" required />
                </div>
              </div>

              <!-- Address Details Section -->
              <h3 class="form-section-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Postal Address
              </h3>
              
              <div class="form-grid">
                <div class="form-group grid-full">
                  <label class="form-label" for="street">Street Address</label>
                  <input type="text" id="street" name="street" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($address['street']); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="area">Area / Locality</label>
                  <input type="text" id="area" name="area" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($address['area']); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="city">City</label>
                  <input type="text" id="city" name="city" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($address['city']); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="state">State</label>
                  <input type="text" id="state" name="state" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($address['state']); ?>" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="pincode">Pincode</label>
                  <input type="text" id="pincode" name="pincode" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($address['pincode']); ?>" required />
                </div>
              </div>

              <!-- Social Links Section -->
              <h3 class="form-section-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                Social Media Links
              </h3>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="facebook">Facebook URL</label>
                  <input type="url" id="facebook" name="facebook" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($social['facebook']); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="instagram">Instagram URL</label>
                  <input type="url" id="instagram" name="instagram" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($social['instagram']); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="linkedin">LinkedIn URL</label>
                  <input type="url" id="linkedin" name="linkedin" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($social['linkedin']); ?>" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="youtube">YouTube Video URL</label>
                  <input type="url" id="youtube" name="youtube" class="form-input" style="padding-left: 1.25rem" value="<?php echo htmlspecialchars($social['youtube']); ?>" />
                </div>
              </div>

              <button type="submit" class="btn-submit">
                Save Contact Details
              </button>
            </form>
          </div>
          
          <?php if ($is_master): ?>
            <!-- TAB 2: ACCESS KEYS -->
            <div id="keys-tab" class="tab-content">
              <h2 class="section-title">Manage Access Keys</h2>
              <p class="section-desc">Generate new staff keys to share access, or revoke keys to deny access instantly.</p>
              
              <!-- Generator Box -->
              <div class="key-generator-box">
                <h3 class="generator-title">Generate New Access Key</h3>
                <p class="generator-desc">Create a descriptive key that you can share with staff members. Staff keys can only edit contact details.</p>
                
                <form action="admin.php" method="POST">
                  <input type="hidden" name="action" value="add_key" />
                  <div class="gen-actions">
                    <div class="form-group" style="flex-grow: 1; margin-bottom: 0;">
                      <label class="form-label" for="new_label">Key Label / Owner Name</label>
                      <input type="text" id="new_label" name="new_label" class="form-input" style="padding-left: 1.25rem" placeholder="e.g. Principal Office, Main Staff Room" required />
                    </div>
                    <div class="form-group" style="flex-grow: 1; margin-bottom: 0;">
                      <label class="form-label" for="new_key">Access Key Code</label>
                      <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="new_key" name="new_key" class="form-input" style="padding-left: 1.25rem" placeholder="e.g. excellence_staff_402" required />
                        <button type="button" class="btn-secondary" onclick="generateRandomKey()">Generate Code</button>
                      </div>
                    </div>
                    <button type="submit" class="btn-submit" style="width: auto; height: 42px; padding: 0 1.5rem; white-space: nowrap; box-shadow: none;">
                      Add Access Key
                    </button>
                  </div>
                </form>
              </div>
              
              <!-- Active Keys List -->
              <h3 class="form-section-header" style="margin-bottom: 1rem;">Active Access Keys</h3>
              <div class="key-table-wrapper">
                <table class="key-table">
                  <thead>
                    <tr>
                      <th>Key Holder Label</th>
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
                        <td colspan="3" style="text-align: center; color: var(--color-text-muted); padding: 2rem;">No custom staff keys active. Create one above!</td>
                      </tr>
                    <?php else: ?>
                      <?php foreach ($ACCESS_KEYS as $k => $label): ?>
                        <tr>
                          <td><?php echo htmlspecialchars($label); ?></td>
                          <td><span class="key-code"><?php echo htmlspecialchars($k); ?></span></td>
                          <td style="text-align: right;">
                            <a href="admin.php?action=revoke_key&key=<?php echo urlencode($k); ?>" class="btn-revoke" onclick="return confirm('Are you sure you want to revoke access for this key?');">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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

  <!-- Footer -->
  <footer>
    <p>© <?php echo date('Y'); ?> Govt. Higher Secondary School for Excellence, Bhopal. All rights reserved.</p>
  </footer>

  <script>
    function switchTab(tabId, el) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      // Show active tab
      document.getElementById(tabId).classList.add('active');
      
      // Deactivate all sidebar items
      document.querySelectorAll('.nav-tab').forEach(item => {
        item.classList.remove('active');
      });
      // Activate clicked item
      el.classList.add('active');
    }
    
    function generateRandomKey() {
      const rand = Math.floor(100 + Math.random() * 900);
      document.getElementById('new_key').value = 'excellence_staff_' + rand;
    }
  </script>
</body>
</html>

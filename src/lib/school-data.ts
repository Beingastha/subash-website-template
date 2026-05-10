import data from '@/data/school-data.json';

export function getSchoolData() {
  return data;
}

export type SchoolData = typeof data;

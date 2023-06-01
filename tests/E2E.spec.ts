import { test, expect } from '@playwright/test';

test('student can register', async ({ page }) => {
  await page.goto('https://consultify.azurewebsites.net/');
  await page.getByRole('button', { name: 'Student' }).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('studentTest');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('studentTest@students.wits.ac.za');
  await page.getByPlaceholder('Password', { exact: true }).click();
  await page.getByPlaceholder('Password', { exact: true }).fill('P@ssword');
  await page.getByPlaceholder('Confirm Password').click();
  await page.getByPlaceholder('Confirm Password').fill('P@ssword');
  await page.getByRole('button', { name: 'Sign up' }).click();
});
test('lecturer can register', async ({ page }) => {
  await page.goto('https://consultify.azurewebsites.net/');
  await page.getByRole('button', { name: 'Lecturer' }).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('lecturerTest');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('lecturerTest@wits.ac.za');
  await page.getByPlaceholder('Password', { exact: true }).click();
  await page.getByPlaceholder('Password', { exact: true }).fill('P@ssword');
  await page.getByPlaceholder('Confirm Password').click();
  await page.getByPlaceholder('Confirm Password').fill('P@ssword');
  await page.getByRole('button', { name: 'Sign up' }).click();
});
test('lecturer can sign-in', async ({ page }) => {
 await page.goto('https://consultify.azurewebsites.net/');
 await page.getByRole('button', { name: 'Sign in' }).click();
 await page.getByRole('link', { name: 'Lecturer' }).click();
 await page.getByPlaceholder('Email').click();
 await page.getByPlaceholder('Email').fill('lecturerTest@wits.ac.za');
 await page.getByPlaceholder('Password').click();
 await page.getByPlaceholder('Password').fill('P@ssword');
 await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
});
test('student can sign-in', async ({ page }) => {
  await page.goto('https://consultify.azurewebsites.net/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Student' }).click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('studentTest@students.wits.ac.za');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('P@ssword');
  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
 });
 test('Admin can sign-in', async ({ page }) => {
  await page.goto('https://consultify.azurewebsites.net/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('admin@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('Adm!n123');
  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
 });
 test('Lecturer create consultation', async ({ page }) => {
  await page.goto('https://consultify.azurewebsites.net/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Lecturer' }).click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('lecturerTest@wits.ac.za');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('P@ssword');
  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: ' Add slot' }).click();
  await page.getByRole('combobox').selectOption('Tuesday');
  await page.locator('#start').click();
  await page.locator('#start').fill('12:00');
  await page.locator('#end').click();
  await page.locator('#end').fill('13:00');
  await page.getByPlaceholder('Max students').click();
  await page.getByPlaceholder('Max students').fill('3');
  await page.getByRole('button', { name: 'Save availability' }).click();
 });

 test('student book consultation', async ({ page }) => {
  await page.goto('https://consultify.azurewebsites.net/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Student' }).click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('studentTest@students.wits.ac.za');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('P@ssword');
  await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: ' Book' }).click();
 });

 test('Lecturer can sign out', async ({ page }) => {
await page.goto('https://consultify.azurewebsites.net/');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Lecturer' }).click();
await page.getByPlaceholder('Email').click();
await page.getByPlaceholder('Email').fill('lecturerTest@wits.ac.za');
await page.getByPlaceholder('Password').click();
await page.getByPlaceholder('Password').fill('P@ssword');
await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('button', { name: '' }).click();
await page.getByRole('link', { name: ' Sign out' }).click();
 });
 test('Student sign out', async ({ page }) => {
await page.goto('https://consultify.azurewebsites.net/');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Student' }).click();
await page.getByPlaceholder('Email').click();
await page.getByPlaceholder('Email').fill('studentTest@students.wits.ac.za');
await page.getByPlaceholder('Password').click();
await page.getByPlaceholder('Password').fill('P@ssword');
await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('listitem').filter({ hasText: 'Dashboard View logs Sign out' }).click();
await page.getByRole('link', { name: ' Sign out' }).click();
   });
 test('Lecturer can look at their logs', async ({ page }) => {
await page.goto('https://consultify.azurewebsites.net/');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Lecturer' }).click();
await page.getByPlaceholder('Email').click();
await page.getByPlaceholder('Email').fill('lecturerTest@wits.ac.za');
await page.getByPlaceholder('Password').click();
await page.getByPlaceholder('Password').fill('P@ssword');
await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('button', { name: '' }).click();
await page.getByRole('link', { name: ' View logs' }).click();
   });
  test('Student can look at their logs', async ({ page }) => {
await page.goto('https://consultify.azurewebsites.net/');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('link', { name: 'Student' }).click();
await page.getByPlaceholder('Email').click();
await page.getByPlaceholder('Email').fill('studentTest@students.wits.ac.za');
await page.getByPlaceholder('Password').click();
await page.getByPlaceholder('Password').fill('P@ssword');
await page.getByRole('main').getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('button', { name: '' }).click();
await page.getByRole('link', { name: ' View logs' }).click();
});
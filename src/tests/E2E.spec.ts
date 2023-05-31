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
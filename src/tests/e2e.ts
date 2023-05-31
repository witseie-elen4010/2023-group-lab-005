import { test, expect } from '@playwright/test'

test('Student Register', async ({ page }) => {
  await page.goto('https://consultify.azurewebsites.net/')
  await page.getByRole('button', { name: 'Student' }).click()
  await page.getByPlaceholder('Name').fill('newStudent2')
  await page.getByPlaceholder('Email').click()
  await page.getByPlaceholder('Email').fill('newStudent2@students.wits.ac.za')
  await page.getByPlaceholder('Password', { exact: true }).click()
  await page.getByPlaceholder('Password', { exact: true }).fill('P@ssword')
  await page.getByPlaceholder('Confirm Password').click()
  await page.getByPlaceholder('Confirm Password').fill('P@ssword')
  await page.getByRole('button', { name: 'Sign up' }).click()
})

test('Lecturer Register', async ({ page }) => {
  await page.goto('https://consultify.azurewebsites.net/')
  await page.getByRole('button', { name: 'Lecturer' }).click()
  await page.getByPlaceholder('Name').click()
  await page.getByPlaceholder('Name').fill('newLec')
  await page.getByPlaceholder('Email').click()
  await page.getByPlaceholder('Email').fill('newLec@wits.ac.za')
  await page.getByPlaceholder('Password', { exact: true }).click()
  await page.getByPlaceholder('Password', { exact: true }).fill('P@ssword')
  await page.getByPlaceholder('Confirm Password').click()
  await page.getByPlaceholder('Confirm Password').fill('P@ssword')
  await page.getByRole('button', { name: 'Sign up' }).click()
})

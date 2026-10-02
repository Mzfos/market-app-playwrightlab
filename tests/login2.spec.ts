import { test, expect } from '@playwright/test';

test.describe('ระบบเข้าสู่ระบบ (Login System Tests)', () => {

  test.beforeEach(async ({ page }) => {
    // เปิดหน้า Login ก่อนเริ่มแต่ละกรณีทดสอบ
    await page.goto('http://localhost:5173/');
  });

// TC04: Login ไม่กรอกข้อมูล -> ตรวจเช็ก HTML5 Required Validation หรือข้อความแจ้งเตือนกรอกข้อมูล
  test('TC04 Login ไม่กรอกข้อมูล', async ({ page }) => {
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    // เช็กว่าช่องเบอร์โทรศัพท์โฟกัสขึ้นเตือน Validation (เกิดจาก attribute required ใน HTML)
    const phoneInput = page.getByLabel('หมายเลขโทรศัพท์มือถือ');
    await expect(phoneInput).toBeEmpty();
  });

// TC05: Login เบอร์โทรศัพท์รูปแบบไม่ถูกต้อง
  test('TC05 Login เบอร์โทรศัพท์รูปแบบไม่ถูกต้อง', async ({ page }) => {
    const phoneInput = page.getByLabel('หมายเลขโทรศัพท์มือถือ');

    await phoneInput.fill('12345');
    await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('uCrwVaBW390_0G0Q5QwAVrqr');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    // เช็กว่า Element ช่องกรอกเบอร์โทรติดสภาวะ :invalid
    await expect(phoneInput).toHaveJSProperty('validity.valid', false);
  });

  // TC06: Login รหัสผ่านสั้นกว่า 8 ตัวอักษร -> ตรวจเช็กความยาวของ Input รหัสผ่าน
  test('TC06 Login รหัสผ่านสั้นกว่า 8 ตัวอักษร', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร');
    
    await page.getByLabel('หมายเลขโทรศัพท์มือถือ').fill('0800000000');
    await passwordInput.fill('1234567');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    // เช็กว่าค่าในช่องรหัสผ่านมีความยาวน้อยกว่า 8 ตัวจริงและระบบไม่พาเปลี่ยนหน้า
    await expect(passwordInput).toHaveValue('1234567');
  });

});


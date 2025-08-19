import { Request, Response } from 'express';
import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser | null = null;
let page: Page | null = null;

export const bukaWeb = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: 'URL tidak boleh kosong' });
    return;
  }

  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized'],
    });
    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    res.json({ success: true, message: 'Halaman dibuka', title });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const isiTeks = async (req: Request, res: Response) => {
  const { items } = req.body as { items: { selector: string; text: string }[] };

  if (!page) {
    res.status(400).json({ error: 'Halaman belum dibuka' });
    return;
  }
  try {
    for (const { selector, text } of items) {
      if (!selector || !text) {
        res.status(400).json({ error: 'Selector dan teks tidak boleh kosong' });
        return;
      }
      await page.waitForSelector(selector);
      await page.type(selector, text);
    }

    res.json({ success: true, message: 'Sukses' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const tutupBrowser = async (req: Request, res: Response) => {
  if (!browser) {
    res.json({ success: false, message: 'Browser belum aktif' });
    return;
  }

  try {
    await browser.close();
    browser = null;
    page = null;
    res.json({ success: true, message: 'Browser ditutup' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const isiSelect = async (req: Request, res: Response) => {
  const { items } = req.body as { items: { selector: string; value: string }[] };

  if (!page) {
    res.status(400).json({ error: 'Halaman belum dibuka' });
    return;
  }

  try {
    for (const { selector, value } of items) {
      if (!selector || !value) {
        res.status(400).json({ error: 'Selector dan value tidak boleh kosong' });
        return;
      }
      await page.waitForSelector(selector);
      await page.select(selector, value);
    }

    res.json({
      success: true,
      message: `Sukses`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const klikButton = async (req: Request, res: Response) => {
  const { selector }: { selector: string } = req.body;

  if (!page) {
    res.status(400).json({ error: 'Halaman belum dibuka' });
    return;
  }

  if (!selector) {
    res.status(400).json({ error: 'Selector wajib diisi' });
    return;
  }

  try {
    await page.waitForSelector(selector, { visible: true });
    await page.click(selector);

    res.json({
      success: true,
      message: `Tombol dengan selector "${selector}" berhasil diklik`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
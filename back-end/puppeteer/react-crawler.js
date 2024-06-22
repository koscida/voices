const puppeteer = require("puppeteer");

(async () => {
	//initiate the browser
	const browser = await puppeteer.launch();

	//create a new in headless chrome
	const page = await browser.newPage();

	//go to target website
	await page.goto(
		"https://reactstorefront.vercel.app/default-channel/en-US/",
		{
			//wait for content to load
			waitUntil: "networkidle0",
		}
	);

	//get product urls
	const imgUrl = await page.evaluate(() =>
		Array.from(document.querySelectorAll("ul.grid > li a")).map(
			(a) => a.href
		)
	);

	console.log(imgUrl);

	await browser.close();
})();

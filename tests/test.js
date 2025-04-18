const {
  Builder,
  By,
  until,
} = require("selenium-webdriver")

;(async function comfyStoreTests() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .build()
  const baseURL = "http://localhost:5501"

  try {
    // 1. Open homepage and check title
    await driver.get(baseURL)
    const title = await driver.getTitle()
    console.log("✅ Title is:", title)

    // 2. Verify navigation links exist
    const navLinks = await driver.findElements(
      By.css(".nav-link")
    )
    console.log(
      `✅ Found ${navLinks.length} nav links`
    )

    // 3. Click 'products' link in navbar using CSS selector
    const productsLink = await driver.findElement(
      By.css('.nav-link[href="products.html"]')
    )
    await productsLink.click()
    await driver.wait(
      until.urlContains("products"),
      5000
    )
    console.log("✅ Navigated to products.html")

    // 4. Go back to home
    await driver.navigate().back()
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl()
      return (
        url.includes("index") ||
        url.endsWith("/") ||
        url.endsWith("5501")
      )
    }, 5000)

    //5. Toggle sidebar menu and verify links (for screen size less than 800 px)

    // await driver
    //   .manage()
    //   .window()
    //   .setRect({ width: 700, height: 800 })
    // const navToggle = await driver.wait(
    //   until.elementLocated(By.css(".toggle-nav")),
    //   5000
    // )
    // await driver.wait(
    //   until.elementIsEnabled(navToggle),
    //   5000
    // )

    // await navToggle.click()

    // await driver.sleep(1000)
    // const sidebarLinks =
    //   await driver.findElements(
    //     By.css(".sidebar-link")
    //   )
    // console.log(
    //   `✅ Sidebar has ${sidebarLinks.length} links`
    // )
    // await driver
    //   .manage()
    //   .window()
    //   .setRect({ width: 1200, height: 800 })

    // 6. Open and close cart
    await driver
      .findElement(By.css(".toggle-cart"))
      .click()
    await driver.sleep(1000)
    const cartTitle = await driver.findElement(
      By.css(".cart header h3")
    )
    console.log(
      "✅ Cart opened with title:",
      await cartTitle.getText()
    )

    await driver
      .findElement(By.css(".cart-close"))
      .click()
    console.log("✅ Cart closed")

    // 7. Check featured section title
    const featuredTitle =
      await driver.findElement(
        By.css(".title h2")
      )
    console.log(
      "✅ Featured section title:",
      await featuredTitle.getText()
    )

    // 8. Click "all products" button
    const allProductsBtn =
      await driver.findElement(
        By.css('a.btn[href="products.html"]')
      )
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      allProductsBtn
    )
    await driver.sleep(1000) // small delay to settle scroll
    await allProductsBtn.click()

    await driver.wait(
      until.urlContains("products"),
      5000
    )
    console.log(
      "✅ Clicked All Products button and navigated"
    )

    // 9. Go back to check footer content loads
    await driver.navigate().back()
    await driver.sleep(1000) // wait for footer fetch
    const footerContainer =
      await driver.findElement(
        By.id("footer-container")
      )
    const footerHTML =
      await footerContainer.getAttribute(
        "innerHTML"
      )
    if (footerHTML.length > 10) {
      console.log(
        "✅ Footer content loaded via fetch()"
      )
    } else {
      console.warn(
        "⚠️ Footer content may be empty."
      )
    }
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.message
    )
  } finally {
    await driver.quit()
  }
})()

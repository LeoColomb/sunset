/**
 * Goodnight
 * Inspired from goodnight by Jared Cubilla
 *
 * @see https://github.com/JaredCubilla/goodnight
 *
 * @author Léo Colombaro (colombaro.fr)
 * @license MIT
 */
export class Goodnight {
  constructor (options = {}) {
    this.options = Object.assign({
      AM: 6,
      PM: 18
    }, options)
    this.hours = new Date().getHours()
    this.links = []
  }

  isNight () {
    return this.hours > this.options.PM || this.hours < this.options.AM
  }

  addCss (filePath) {
    if (!filePath) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = filePath
    this.links.push(link)

    if (this.isNight()) {
      document.documentElement.firstChild.appendChild(link)
    }
  }

  setClass (className) {
    if (this.isNight()) {
      document.body.classList.toggle(className || 'goodnight')
    }
  }

  toggle () {
    for (const link of this.links) {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      } else {
        document.documentElement.firstChild.appendChild(link)
      }
    }
  }
}

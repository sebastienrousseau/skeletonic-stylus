# 📚 The Skeletonic Stylus Library

![Banner representing the Skeletonic Stylus Library][skeletonic stylus library]

[![npm](https://img.shields.io/npm/v/@sebastienrousseau/skeletonic-stylus.svg?style=for-the-badge\&color=f14041)](https://www.npmjs.com/package/@sebastienrousseau/skeletonic-stylus)
![Codacy grade](https://img.shields.io/codacy/grade/b3d54aa6263142c19a640eef423fe341?style=for-the-badge)
[![Contributors][contributors-shield]](https://github.com/sebastienrousseau/skeletonic-stylus/graphs/contributors)
[![Forks][forks-shield]](https://github.com/sebastienrousseau/skeletonic-stylus/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge\&color=ff69b4)](https://opensource.org/licenses/MIT)
![Made with Love](./images/made-with-love.svg)

**[Website](https://skeletonic.io) • [Documentation](https://docs.skeletonic.io)
• [Report Bug](https://github.com/sebastienrousseau/skeletonic-stylus/issues)
• [Request Feature](https://github.com/sebastienrousseau/skeletonic-stylus/issues)
• [Contributing Guidelines](https://github.com/sebastienrousseau/skeletonic-stylus/blob/master/.github/CONTRIBUTING.md)**

***

## 👋 Welcome to the Skeletonic Stylus Library

The Stylus Skeletonic Library is a lightweight, intuitive, accessible and ultra-responsive Stylus Library.
It is based on the [Skeleton](http://getskeleton.com) framework and is written in [Stylus](http://stylus-lang.com).

[![Getting Started](./images/button-primary.svg)](#the-skeletonic-stylus-library)
[![Download the Skeletonic Stylus Library v1.1.5](./images/button-secondary.svg)](https://github.com/sebastienrousseau/skeletonic-stylus/archive/v1.1.5.zip)

## Index

-   [📚 The Skeletonic Stylus Library](#-the-skeletonic-stylus-library)
  -   [👋 Welcome to the Skeletonic Stylus Library](#-welcome-to-the-skeletonic-stylus-library)
  -   [Index](#index)
  -   [The Skeletonic Stylus Library](#the-skeletonic-stylus-library)
    -   [Documentation](#documentation)
  -   [Installation](#installation)
    -   [From NPM or YARN](#from-npm-or-yarn)
    -   [From CDN](#from-cdn)
    -   [From GitHub](#from-github)
  -   [What's included](#whats-included)
    -   [Support for bidirectional languages](#support-for-bidirectional-languages)
    -   [Versioning](#versioning)
    -   [Built with](#built-with)
  -   [Contributing](#contributing)
    -   [Code of Conduct](#code-of-conduct)
    -   [Our Values](#our-values)
    -   [Releases](#releases)
    -   [License](#license)
    -   [Acknowledgements](#acknowledgements)

## The Skeletonic Stylus Library

[Skeletonic Stylus Library](https://github.com/sebastienrousseau/skeletonic-stylus) is a lightweight, intuitive, accessible and ultra-responsive Stylus Library.

The library provides modular components built for speed, higher performance, with the aim of helping you come to grips with common pain points in mobile and web application design and development.

The Skeletonic Stylus Library is a collection of components, functions, and mixins made with [Stylus](https://stylus-lang.com/). The components and mixins can be used on their own to build modern web sites and applications, but they are also designed to be used in combination with a wide variety of existing technologies.

### Documentation

To read the Skeletonic Stylus Documentation, please visit:

-   English Documentation: <https://docs.skeletonic.io/en>
-   Documentation Française: <https://docs.skeletonic.io/fr>
-   Documentation source code: <https://github.com/sebastienrousseau/skeletonic-docs>

## Installation

### From NPM or YARN

To install the Skeletonic Stylus Library, use either npm or yarn as follows:

-   `npm install skeletonic-stylus`
-   `yarn add skeletonic-stylus`

### From CDN

A pre-bundled package that contains all compiled CSS, components and mixins needed to use is available on CDN.

The following table lists alternate CDN locations where Skeletonic Stylus is hosted.

| CDN                                   | URL                                                                           | HTTPS | Combo |
| ------------------------------------- | ----------------------------------------------------------------------------- | ----- | ----- |
| [GitHub Packages](https://docs.github.com/en/packages)           | <https://github.com/sebastienrousseau/skeletonic-stylus/packages>            | Yes   | No    |
| [unpkg](https://unpkg.com/)           | <https://unpkg.com/skeletonic-stylus@1.1.5/css/skeletonic.min.css>            | Yes   | No    |
| [jsDelivr](https://www.jsdelivr.com/) | <https://cdn.jsdelivr.net/npm/skeletonic-stylus@1.1.5/css/skeletonic.min.css> | Yes   | Yes   |

### From GitHub

Clone the main repository to get all source files including build scripts: `git clone https://github.com/sebastienrousseau/skeletonic-stylus.git`

## What's included

Within the download you'll find all the Stylus source files, compiled and minified CSS bundles as well as [CSS sourcemaps](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps) grouped into the _dist_ folder.

You'll see something like this:

```bash
skeletonic-1.1.5
dist
[ 256]  ./
├── [ 224]  css/
│   ├── [ 192]  animations/
│   │   ├── [2.0K]  skeletonic-animations-report.txt
│   │   ├── [349K]  skeletonic-animations.css
│   │   ├── [395K]  skeletonic-animations.css.map
│   │   └── [110K]  skeletonic-animations.min.css
│   ├── [ 192]  core/
│   │   ├── [1.6K]  skeletonic-report.txt
│   │   ├── [ 48K]  skeletonic.css
│   │   ├── [ 72K]  skeletonic.css.map
│   │   └── [ 37K]  skeletonic.min.css
│   ├── [ 192]  fonts/
│   │   ├── [1.8K]  skeletonic-fonts-report.txt
│   │   ├── [6.3K]  skeletonic-fonts.css
│   │   ├── [7.7K]  skeletonic-fonts.css.map
│   │   └── [4.7K]  skeletonic-fonts.min.css
│   ├── [ 192]  hebrew-fonts/
│   │   ├── [2.0K]  skeletonic-hebrew-fonts-report.txt
│   │   ├── [7.6K]  skeletonic-hebrew-fonts.css
│   │   ├── [9.0K]  skeletonic-hebrew-fonts.css.map
│   │   └── [5.8K]  skeletonic-hebrew-fonts.min.css
│   └── [ 160]  palettes/
│       ├── [ 192]  material/
│       │   ├── [1.9K]  skeletonic-material-report.txt
│       │   ├── [ 22K]  skeletonic-material.css
│       │   ├── [ 34K]  skeletonic-material.css.map
│       │   └── [ 17K]  skeletonic-material.min.css
│       ├── [ 192]  tachyons/
│       │   ├── [1.9K]  skeletonic-tachyons-report.txt
│       │   ├── [8.7K]  skeletonic-tachyons.css
│       │   ├── [ 13K]  skeletonic-tachyons.css.map
│       │   └── [6.9K]  skeletonic-tachyons.min.css
│       └── [ 192]  websafe/
│           ├── [1.9K]  skeletonic-websafe-report.txt
│           ├── [4.1K]  skeletonic-websafe.css
│           ├── [6.2K]  skeletonic-websafe.css.map
│           └── [3.3K]  skeletonic-websafe.min.css
├── [ 256]  images/
│   ├── [ 12K]  button-primary.svg
│   ├── [6.3K]  button-secondary.svg
│   ├── [1.4K]  made-with-love.svg
│   ├── [ 19K]  skeletonic-logo.svg
│   ├── [294K]  skeletonic-stylus-logo.svg
│   └── [ 55K]  skeletonic-stylus-readme.svg
├── [ 480]  stylus/
│   ├── [ 448]  animations/
│   │   ├── [ 448]  Distracting/
│   │   │   ├── [ 402]  bounce.styl
│   │   │   ├── [1.2K]  chameleonbackground.styl
│   │   │   ├── [1.2K]  chameleontext.styl
│   │   │   ├── [ 314]  flash.styl
│   │   │   ├── [ 462]  heartbeat.styl
│   │   │   ├── [ 693]  jelly.styl
│   │   │   ├── [ 389]  pulse.styl
│   │   │   ├── [ 581]  rubber.styl
│   │   │   ├── [3.3K]  shake.styl
│   │   │   ├── [ 500]  swing.styl
│   │   │   ├── [ 587]  tada.styl
│   │   │   └── [ 718]  wobble.styl
│   │   ├── [ 384]  Fading/
│   │   │   ├── [ 360]  fadeIn.styl
│   │   │   ├── [ 447]  fadeInDown.styl
│   │   │   ├── [ 447]  fadeInLeft.styl
│   │   │   ├── [ 451]  fadeInRight.styl
│   │   │   ├── [ 436]  fadeInUp.styl
│   │   │   ├── [ 368]  fadeOut.styl
│   │   │   ├── [ 452]  fadeOutDown.styl
│   │   │   ├── [ 452]  fadeOutLeft.styl
│   │   │   ├── [ 456]  fadeOutRight.styl
│   │   │   └── [ 441]  fadeOutUp.styl
│   │   ├── [ 224]  Flipping/
│   │   │   ├── [1002]  flip.styl
│   │   │   ├── [ 721]  flipInHorizontal.styl
│   │   │   ├── [ 713]  flipInVertical.styl
│   │   │   ├── [ 740]  flipOutHorizontal.styl
│   │   │   └── [ 513]  flipOutVertical.styl
│   │   ├── [ 128]  Pop/
│   │   │   ├── [ 369]  popIn.styl
│   │   │   └── [ 373]  popOut.styl
│   │   ├── [ 128]  Rolling/
│   │   │   ├── [ 414]  rollIn.styl
│   │   │   └── [ 416]  rollOut.styl
│   │   ├── [ 128]  Rotating/
│   │   │   ├── [ 411]  spinLeft.styl
│   │   │   └── [ 415]  spinRight.styl
│   │   ├── [ 320]  Sliding/
│   │   │   ├── [ 457]  slideInDown.styl
│   │   │   ├── [ 457]  slideInLeft.styl
│   │   │   ├── [ 461]  slideInRight.styl
│   │   │   ├── [ 446]  slideInUp.styl
│   │   │   ├── [ 459]  slideOutDown.styl
│   │   │   ├── [ 461]  slideOutLeft.styl
│   │   │   ├── [ 465]  slideOutRight.styl
│   │   │   └── [ 451]  slideOutUp.styl
│   │   ├── [ 128]  Vanishing/
│   │   │   ├── [ 480]  vanishIn.styl
│   │   │   └── [ 484]  vanishOut.styl
│   │   ├── [ 128]  Zooming/
│   │   │   ├── [ 347]  zoomIn.styl
│   │   │   └── [ 354]  zoomOut.styl
│   │   ├── [ 189]  README.md
│   │   ├── [1.9K]  _contents.styl
│   │   └── [1.4K]  animationsBase.styl
│   ├── [ 192]  base/
│   │   ├── [ 161]  README.md
│   │   ├── [  44]  _contents.styl
│   │   ├── [2.1K]  helpers.styl
│   │   └── [1.3K]  reset.styl
│   ├── [ 224]  components/
│   │   ├── [ 171]  README.md
│   │   ├── [  64]  _contents.styl
│   │   ├── [1.3K]  card.styl
│   │   ├── [ 555]  header.styl
│   │   └── [3.0K]  navbar.styl
│   ├── [ 192]  configurations/
│   │   ├── [ 185]  README.md
│   │   ├── [  47]  _contents.styl
│   │   ├── [3.0K]  colors.styl
│   │   └── [2.2K]  variables.styl
│   ├── [ 576]  elements/
│   │   ├── [ 167]  README.md
│   │   ├── [ 310]  _contents.styl
│   │   ├── [6.1K]  button.styl
│   │   ├── [ 476]  clipboard.styl
│   │   ├── [3.1K]  code.styl
│   │   ├── [2.7K]  divider.styl
│   │   ├── [ 332]  fieldset.styl
│   │   ├── [3.0K]  form.styl
│   │   ├── [ 282]  image.styl
│   │   ├── [ 175]  label.styl
│   │   ├── [4.4K]  link-effects.styl
│   │   ├── [ 740]  link.styl
│   │   ├── [ 546]  list.styl
│   │   ├── [ 708]  margin.styl
│   │   ├── [ 679]  padding.styl
│   │   └── [ 662]  table.styl
│   ├── [ 160]  fonts/
│   │   ├── [ 171]  README.md
│   │   ├── [  25]  _contents.styl
│   │   └── [6.2K]  open-sans.styl
│   ├── [ 160]  hebrew-fonts/
│   │   ├── [ 171]  README.md
│   │   ├── [  32]  _contents.styl
│   │   └── [7.5K]  open-sans-hebrew.styl
│   ├── [ 224]  layout/
│   │   ├── [ 165]  README.md
│   │   ├── [  74]  _contents.styl
│   │   ├── [ 420]  container.styl
│   │   ├── [ 658]  grid.styl
│   │   └── [ 762]  media-queries.styl
│   ├── [ 224]  palettes/
│   │   ├── [ 181]  README.md
│   │   ├── [  72]  _contents.styl
│   │   ├── [5.8K]  material.styl
│   │   ├── [2.4K]  tachyons.styl
│   │   └── [5.2K]  websafe.styl
│   ├── [ 160]  utilities/
│   │   ├── [ 171]  README.md
│   │   ├── [  22]  _contents.styl
│   │   └── [ 405]  mixins.styl
│   ├── [ 154]  README.md
│   └── [ 256]  skeletonic.styl
├── [ 16K]  README.md
├── [ 11K]  filesize-report.txt
└── [ 14K]  package.json

30 directories, 135 files
```
### Support for bidirectional languages

The Skeletonic Stylus Library can display Hebrew text and provides an extension font covering the Hebrew alphabet: [Open Sans Hebrew](https://open-sans.com/hebrew.html).

Simply link the CSS in your HTML document:

`<link rel="stylesheet" type="text/css" href="skeletonic-hebrew-fonts.min.css" />`

### Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, the Skeletonic Stylus Library is maintained under the [Semantic Versioning](https://semver.org/) guidelines.

### Built with

-   [CleanCSS](https://github.com/jakubpawlowicz/clean-css) - CleanCSS is a fast and efficient CSS optimizer for Node.js platform and any modern browser.
-   [CSSO](https://github.com/css/csso) - CSSO (CSS Optimizer) is a CSS minifier with structural optimizations.
-   [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
-   [NPM](https://www.npmjs.com/about) - npm is the package manager for Node.js.
-   [Open Sans](https://open-sans.com/) - Open Sans is a humanist sans serif typeface designed by Steve Matteson.
-   [PostCSS](https://github.com/postcss/postcss) - PostCSS is a tool for transforming styles with JS plugins.
-   [Stylus Supremacy](https://thisismanta.github.io/stylus-supremacy/) - Stylus Supremacy is a JavaScript library for formatting Stylus files.
-   [Stylus](http://stylus-lang.com/) - Expressive, robust, feature-rich CSS language built for nodejs

## Contributing

Please read carefully through our [Contributing Guidelines](https://github.com/sebastienrousseau/skeletonic-stylus/blob/main/.github/CONTRIBUTING.md) for further details on the process for submitting pull requests to us.

### Code of Conduct

We are committed to preserving and fostering a diverse, welcoming community. Please read our [Code of Conduct](https://github.com/sebastienrousseau/skeletonic-stylus/blob/main/.github/CODE_OF_CONDUCT.md).

### Our Values

-   We believe perfection must consider everything.
-   We take our passion beyond code into our daily practices.
-   We are just obsessed about creating and delivering exceptional solutions.

### Releases

-   See [Skeletonic Release](https://github.com/sebastienrousseau/skeletonic-stylus/releases) list.

### License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sebastienrousseau/skeletonic-stylus/blob/main/LICENSE) file for details

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsebastienrousseau%2Fskeletonic-stylus.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsebastienrousseau%2Fskeletonic-stylus?ref=badge_large)

### Acknowledgements

[The Skeletonic Stylus Library](https://skeletonicstylus.com) is beautifully crafted by these people and a bunch of awesome [contributors](https://github.com/sebastienrousseau/skeletonic-stylus/graphs/contributors)

| Contributors |
|---------|
|[![Sebastien Rousseau](https://avatars0.githubusercontent.com/u/1394998?s=117)](https://sebastienrousseau.co.uk)|
|[Sebastien Rousseau](https://github.com/sebastienrousseau)|

[contributors-shield]: https://img.shields.io/github/contributors/sebastienrousseau/skeletonic-stylus.svg?style=for-the-badge
[contributors-url]: https://github.com/sebastienrousseau/skeletonic-stylus/graphs/contributors
[skeletonic stylus library]: ./images/skeletonic-stylus-logo.svg "skeletonic stylus library"
[divider]: https://raw.githubusercontent.com/sebastienrousseau/skeletonic-stylus/master/assets/divider.svg "divider"
[download]: https://raw.githubusercontent.com/sebastienrousseau/skeletonic-stylus/master/assets/button-secondary.svg
[forks-shield]: https://img.shields.io/github/forks/sebastienrousseau/skeletonic-stylus.svg?style=for-the-badge
[forks-url]: https://github.com/sebastienrousseau/skeletonic-stylus/network/members
[getting started]: https://raw.githubusercontent.com/sebastienrousseau/skeletonic-stylus/master/assets/button-primary.svg
[issues-shield]: https://img.shields.io/github/issues/sebastienrousseau/skeletonic-stylus.svg?style=for-the-badge
[issues-url]: https://github.com/sebastienrousseau/skeletonic-stylus/issues

# Welcome

![alt text][logo]

[logo]: ./images/skeletonic-stylus.svg "Banner representing the Skeletonic Stylus Library"

> ⭐ We appreciate your star rating and valuable feedback.

[![npm](https://img.shields.io/npm/v/skeletonic-stylus.svg)](https://www.npmjs.com/package/skeletonic-stylus)
[![npm](https://img.shields.io/npm/dm/skeletonic-stylus.svg)](https://www.npmjs.com/package/skeletonic-stylus)
[![Packagist](https://img.shields.io/badge/license-MIT-blue.svg)](https://skeletonic-stylus.github.io/license)

## What is Skeletonic Stylus?

**[Skeletonic Stylus Library](https://github.com/sebastienrousseau/skeletonic-stylus)** is a lightweight, intuitive, accessible and ultra-responsive Stylus Library.

The library provides modular components built for speed, higher performance, with the aim of helping you come to grips with common pain points in mobile and web application design and development.

Whether you're looking to integrate a common set of components into an existing website or mobile app, or need more control over the components, we've got you covered.

[![Getting Started](./images/button-primary.svg)](#getting-started)
[![Download Skeletonic Stylus v1.0.1](./images/button-secondary.svg)](https://github.com/sebastienrousseau/skeletonic-stylus/archive/v1.0.1.zip)

## Table of contents

- [Welcome](#welcome)
  - [What is Skeletonic Stylus?](#what-is-skeletonic-stylus)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
      - [From NPM or YARN](#from-npm-or-yarn)
      - [From CDN](#from-cdn)
      - [From GitHub](#from-github)
  - [What's included](#whats-included)
  - [Versioning](#versioning)
  - [Built with](#built-with)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Our Values](#our-values)
  - [Releases](#releases)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Getting Started

[The Skeletonic Stylus Library](https://skeletonicstylus.com) is a collection of components, functions, and mixins made with [Stylus](https://stylus-lang.com/). The components and mixins can be used on their own to build modern web sites and applications, but they are also designed to be used in combination with a wide variety of existing technologies.

### Installation

#### From NPM or YARN

To install the Skeletonic Stylus Library, use either npm or yarn as follows:

- `npm install skeletonic-stylus`
- `yarn add skeletonic-stylus`

#### From CDN

A pre-bundled package that contains all compiled CSS, components and mixins needed to use is available on CDN.

The following table lists alternate CDN locations where Skeletonic Stylus is hosted.

| CDN | URL | HTTPS | Combo |
|---|---|---|---|
| [unpkg](https://unpkg.com/) | <https://unpkg.com/browse/skeletonic-stylus@1.0.1/css/skeletonic.min.css> | Yes | No |
| [jsDelivr](https://www.jsdelivr.com/) | <https://cdn.jsdelivr.net/npm/skeletonic-stylus@1.0.1/css/skeletonic.min.css>  | Yes | Yes |

#### From GitHub

Clone the main repository to get all source files including build scripts: `git clone https://github.com/sebastienrousseau/skeletonic-stylus.git`

## What's included

Within the download you'll find all the Stylus source files, compiled and minified CSS bundles as well as [CSS sourcemaps](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps) grouped into the *dist* folder.

You'll see something like this:

```bash
skeletonic-1.0.1
├── README.md
├── css
│   ├── skeletonic-animations.css
│   ├── skeletonic-animations.css.map
│   ├── skeletonic-animations.min.css
│   ├── skeletonic-colors.css
│   ├── skeletonic-colors.css.map
│   ├── skeletonic-colors.min.css
│   ├── skeletonic-fonts.css
│   ├── skeletonic-fonts.css.map
│   ├── skeletonic-fonts.min.css
│   ├── skeletonic.css
│   ├── skeletonic.css.map
│   └── skeletonic.min.css
├── images
│   ├── button-primary.svg
│   ├── button-secondary.svg
│   ├── skeletonic-stylus-readme.svg
│   └── skeletonic-stylus.svg
├── package.json
└── stylus
    ├── README.md
    ├── animations
    │   ├── README.md
    │   ├── _contents.styl
    │   ├── bounce.styl
    │   ├── chameleon.styl
    │   ├── fade-in.styl
    │   ├── fade-out.styl
    │   ├── flash.styl
    │   ├── pop-in.styl
    │   ├── pulse.styl
    │   ├── rotation.styl
    │   ├── shake.styl
    │   ├── vanish-in.styl
    │   ├── vanish-out.styl
    │   ├── wobble.styl
    │   └── zoom-in.styl
    ├── base
    │   ├── README.md
    │   ├── _contents.styl
    │   ├── helpers.styl
    │   └── reset.styl
    ├── components
    │   ├── README.md
    │   ├── _contents.styl
    │   ├── card.styl
    │   ├── header.styl
    │   └── navbar.styl
    ├── configurations
    │   ├── README.md
    │   ├── _contents.styl
    │   ├── colors.styl
    │   ├── media-queries.styl
    │   └── variables.styl
    ├── debugging
    │   ├── base64
    │   └── images
    ├── elements
    │   ├── README.md
    │   ├── _contents.styl
    │   ├── button.styl
    │   ├── clipboard.styl
    │   ├── code.styl
    │   ├── divider.styl
    │   ├── fieldset.styl
    │   ├── form.styl
    │   ├── image.styl
    │   ├── label.styl
    │   ├── link-effects.styl
    │   ├── link.styl
    │   ├── list.styl
    │   ├── margin.styl
    │   ├── padding.styl
    │   └── table.styl
    ├── fonts
    │   ├── README.md
    │   ├── _contents.styl
    │   └── font-face.styl
    ├── layout
    │   ├── README.md
    │   ├── _contents.styl
    │   ├── container.styl
    │   └── grid.styl
    ├── palettes
    │   ├── README.md
    │   ├── _contents.styl
    │   ├── material.styl
    │   ├── tachyons.styl
    │   └── websafe.styl
    └── skeletonic.styl
```

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, the Skeletonic Stylus Library is maintained under the [Semantic Versioning](https://semver.org/) guidelines.

## Built with

- [CleanCSS](https://github.com/jakubpawlowicz/clean-css) - CleanCSS is a fast and efficient CSS optimizer for Node.js platform and any modern browser.
- [CSSO](https://github.com/css/csso) - CSSO (CSS Optimizer) is a CSS minifier with structural optimizations.
- [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [NPM](https://www.npmjs.com/about) - npm is the package manager for Node.js.
- [PostCSS](https://github.com/postcss/postcss) - PostCSS is a tool for transforming styles with JS plugins.
- [Stylus Supremacy](https://thisismanta.github.io/stylus-supremacy/) - Stylus Supremacy is a JavaScript library for formatting Stylus files.
- [Stylus](http://stylus-lang.com/) - Expressive, robust, feature-rich CSS language built for nodejs

## Contributing

Please read carefully through our [Contributing Guidelines](https://github.com/sebastienrousseau/skeletonic-stylus/blob/main/CONTRIBUTING.md) for further details on the process for submitting pull requests to us.

## Code of Conduct

We are committed to preserving and fostering a diverse, welcoming community. Please read our [Code of Conduct](https://github.com/sebastienrousseau/skeletonic-stylus/blob/main/CODE_OF_CONDUCT.md).

## Our Values

1. We believe perfection must consider everything.
2. We take our passion beyond Code into our daily practices.
3. We are just obsessed about creating and delivering exceptional solutions.

## Releases

- See [Skeletonic Release](https://github.com/sebastienrousseau/skeletonic-stylus/releases) list.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sebastienrousseau/skeletonic-stylus/blob/main/LICENSE.md) file for details

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsebastienrousseau%2Fskeletonic-stylus-readme.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsebastienrousseau%skeletonic-stylus?ref=badge_large)

## Acknowledgements

[The Skeletonic Stylus Library](https://skeletonicstylus.com) is beautifully crafted by these people and a bunch of awesome [contributors](https://github.com/sebastienrousseau/skeletonic-stylus/graphs/contributors)

[![Sebastien Rousseau](https://avatars0.githubusercontent.com/u/1394998?s=117)](https://sebastienrousseau.co.uk) |
|:---:
[Sebastien Rousseau](https://github.com/sebastienrousseau) |

Made with ❤ in London. Powered by [Stylus](https://stylus-lang.com/).
# [The Skeletonic Stylus Library](https://skeletonic-stylus.io)

![alt text][logo]

[logo]: ./images/skeletonic-stylus.svg "The Skeletonic Stylus Library banner"

**[The Skeletonic Stylus Library](https://github.com/sebastienrousseau/skeletonic-stylus)** is a lightweight, intuitive, accessible and ultra-responsive Stylus Library to streamline your digital and mobile web development needs. Proudly made with Stylus ❤

> [Download the Skeletonic Stylus Library v0.0.1](https://github.com/sebastienrousseau/skeletonic-stylus/archive/v0.0.1.zip)

⭐ We appreciate your star rating and valuable feedback.

[![NPM](https://nodei.co/npm/skeletonic-stylus.png)](https://nodei.co/npm/skeletonic-stylus/)

[![npm version](https://badge.fury.io/js/skeletonic-stylus.svg)](https://badge.fury.io/js/skeletonic-stylus)
[![Build Status](https://travis-ci.org/sebastienrousseau/skeletonic-stylus.svg?branch=main)](https://travis-ci.org/sebastienrousseau/skeletonic-stylus)
[![Packagist](https://img.shields.io/badge/license-MIT-blue.svg)](https://skeletonic-stylus.github.io/license)

## History

| Date        | Version | Notes                                     |
| ----------- | ------- | ----------------------------------------- |
| 2021-Jun-05 | v0.0.1  | First public release of Skeletonic Stylus |

## Table of contents

- [The Skeletonic Stylus Library](#the-skeletonic-stylus-library)
  - [History](#history)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Local Setup](#local-setup)
  - [What's included](#whats-included)
  - [Alternate CDN locations](#alternate-cdn-locations)
  - [Versioning](#versioning)
  - [Built With](#built-with)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Our Values](#our-values)
  - [Releases](#releases)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Getting Started

[The Skeletonic Stylus Library](https://skeletonic-stylus.io) is a collection of components and mixins made with [Stylus](https://github.com/stylus/stylus) and modern Web Standards. The library is designed for better performance, higher productivity and aims to help you come to grips with some of the most common challenges in mobile and web application design and development. The components and mixins can be used on their own to build modern web sites and applications, but they are also designed to be used in combination with a wide variety of existing technologies.

### Installation

To install the Skeletonic Stylus Library, use either npm or yarn as follows:

- `npm install skeletonic-stylus`
- `yarn add skeletonic-stylus`

> Looking for a setup that integrates with a particular front-end framework or bundler? Check out our integration docs.

## What's included

Within the download you'll find all the source files, compiled and minified CSS bundles as well as the [CSS sourcemaps](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps) grouped into the *dist* folder.

You'll see something like this:

```bash
skeletonic-0.0.1
├── css
│   ├── skeletonic.animations.css
│   ├── skeletonic.animations.css.map
│   ├── skeletonic.animations.min.css
│   ├── skeletonic.colors.css
│   ├── skeletonic.colors.css.map
│   ├── skeletonic.colors.min.css
│   ├── skeletonic.css
│   ├── skeletonic.css.map
│   ├── skeletonic.fonts.css
│   ├── skeletonic.fonts.css.map
│   ├── skeletonic.fonts.min.css
│   └── skeletonic.min.css
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
    │   ├── reset.styl
    │   └── utilities.styl
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

## Alternate CDN locations

The following table lists alternate CDN locations where Skeletonic is hosted.

| CDN | URL | HTTPS | Combo |
|---|---|---|---|
| [unpkg](https://unpkg.com/) | <https://unpkg.com/skeletonic@0.0.1/dist/skeletonic.min.css> | Yes | No |
| [jsDelivr](https://www.jsdelivr.com/) | <https://cdn.jsdelivr.net/npm/skeletonic/dist/skeletonic.min.css>  | Yes | Yes |

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, the Skeletonic Stylus Library is maintained under the [Semantic Versioning](https://semver.org/) guidelines.

## Built With

- [Gulp](https://gulpjs.com/) - The streaming build system
- [Stylus](http://stylus-lang.com/) - Expressive, robust, feature-rich CSS language built for nodejs
- [CSScomb](http://csscomb.com/) - CSS coding style formatter

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

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsebastienrousseau%2Fskeletonic-stylus.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsebastienrousseau%skeletonic-stylus?ref=badge_large)

## Acknowledgements

[The Skeletonic Stylus Library](https://skeletonic-stylus.io) is beautifully crafted by these people and a bunch of awesome [contributors](https://github.com/sebastienrousseau/skeletonic-stylus/graphs/contributors)

[![Sebastien Rousseau](https://avatars0.githubusercontent.com/u/1394998?s=117)](https://sebastienrousseau.co.uk) |
|:---:
[Sebastien Rousseau](https://github.com/sebastienrousseau) |

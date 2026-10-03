# Animal Cell Systems Lab — PhET-source adaptation

This branch contains an **adaptation overlay** intended to be copied onto the official
`phetsims/gene-expression-essentials` source tree and built with the PhET
`adapted-from-phet` brand.

## Learning design

The simulation is intentionally organized as:

1. **Learn** — short visual + spoken organelle explanations.
2. **Explore** — student-controlled comparison of organelles.
3. **What Happens If?** — change one variable and observe cause/effect.
4. **Cell Rescue Challenge** — diagnose a failing cell using evidence.

The goal is not organelle-name memorization. The core question is:

> How do cell parts work together to keep an animal cell alive?

## Build

The workflow in `.github/workflows/build-animal-cell-phet.yml` clones the official
PhET dependencies, overlays the custom source files, and builds with:

```
grunt --brands=adapted-from-phet
```

The built HTML is uploaded as a GitHub Actions artifact.

## Attribution

This is an adapted, non-commercial educational project based on PhET source.
Original PhET software and assets remain subject to their original licenses and
attribution requirements.

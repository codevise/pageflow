# Motif Area Handling

Placing text and other components (content elements) on viewport
covering images and videos (backdrop assets) is central to the design
aesthetic of Pageflow Scrolled. The mechanisms described in this
document aim to partly automate the layout process inside sections in
order to optimize the visual interplay of content elements and
backdrop assets.

## Assumptions

* To prevent overlong lines of text, a maximal content width is
  enforced on wide viewports. The editor can choose to position the
  resulting content column on the left, the right or in a centered
  position. On narrow viewports, content uses the available space -
  positioning settings do not take effect.

* Backdrop assets can contain a single rectangular *motif area* that
  represents the most important part of what is depicted.

## Goals

1. Since backdrop assets cover the viewport, depending on viewport
   size, parts of the asset will be cropped. We want to make sure that
   as much of the motif area as possible is visible.

2. When the viewport is wide enough, for backdrop assets with
   off-center motif areas, we want to support arrangements where
   content elements are displayed on one side of the viewport and the
   motif area is visible on the other. To make text readable, we can
   display a shadow gradient behind text. This shadow shall only cover
   non essential parts of the image.

3. Especially for narrow viewports or centered motif areas, we want to
   make sure that both the motif area can be looked at and text is
   easy to read.

4. For sections with dynamic height, we want to make sure that the
   section is tall enough such that the motif area of the backdrop
   asset can actually be seen.

## High Level Approach

* Scale the backdrop to cover the whole viewport. Choose background
  position to center the motif area in the viewport. (Goal 1)

* Display content and motif side by side if content area does not
  intersect with motif area horizontally. (Goal 2)

* If content intersects with motif area horizontally, shift the
  content down to allow first looking at the motif and later reading
  the text. Fade in shadow layers to improve contrast once the content
  has been scrolled up and starts intersecting with the motif area
  vertically. (Goal 3)

* For sections with dynamic height, choose a min height according to
  the motif area. (Goal 4)

## Section Transitions

To understand the details of some of the following mechanisms, it
makes sense to first take a closer look at the way sections enter and
exit the viewport.

From the editor's point of view, section transitions are a property of
the boundary between two sections. The transitions are named according
the way the two sections interact during the transiton:

- `fadeBg`: The section backdrops perform a fade animation.

- `scrollIn`: The secion backdrops scroll in without relative movement

- `scrollOver`: The backdrop of the entering section overlays the
  backdrop of the exiting section.

- `reveal`: The backdrop of the exiting section reveals the backdrop
  of the entering section.

- `beforeAfter`: Both section backdrops remain in a fixed position
  causing a before/after effect at the section boundary.

- `fade`: Like `fadeBg`, but also fade the foreground content of the
  two sections fade in and out. Note that this is the only transition
  that effects the foreground of the sections.

The fact that this property is stored in the configuration of the
entering section is an implementation detail.

### Enter and Exit Transition

Note that there are three ways the backdrop of a section can enter the
viewport:

- It can `scrollIn` together with the content.
- It can `reveal` itself, i.e. be in a fixed position.
- It can `fadeIn` once the section becomes active.

Similarly, there are three ways the backdrop of a section can leave
the viewport:

- It can `scrollOut` togther with the content.
- It can `conceal` itself, i.e. stay in a fixed position.
- It can `fadeOut` once the section becomes inactive.

Which of these enter and exit transitions is used depends on the
transitions that have been configured for the section itself and the
following section.

Still, the behavior of the backdrop while passing the viewport is
completely determined by the combination of the enter and exit
transitions. No matter if the configured transitions of the section
itself and the following section are `scrollOver`/`scrollOver`,
`scrollOver`/`beforeAfter`, `scroll`/`scrollOver` or
`scroll`/`beforeAfter`, the resulting enter and exit transitions for
the backdrop will be `scrollIn`/`conceal` in all cases.

When considering different scenarios for backdrop positioning, we thus
only need to look at different combinations of enter and exit
transitions of the section.

### Section Height

Sections can be configured to either have full height of dynamic
height. Full height means the section's foreground will at least have
viewport height. Otherwise the section content determines the
foreground height.

* Note that fade transitions require both involved sections to have
  full height. This makes sure that fade effects can only occur
  between two viewport covering asserts. Backdrops of dynamic height
  sections can also cover the viewport if the section has enough
  content. Still, whether or not the viewport is actually covered
  depends on the viewport size.

* Sections with dynamic height and little or no content (also referred
  to as short sections) will not cover tall viewports. Backdrop assets
  are still scaled to cover the viewport.

  Note that this is required to make the `reveal`/`conceal` case work
  for short sections: Every part of the viewport covering fixed
  backdrop asset eventually becomes visible as the short section
  passes the viewport.

  Moreover, this ensures that backdrop asset scale does not depend on
  section height. This is helpful when creating scroll animations by
  placing similar images in adjacent sections using a `beforeAfter`
  transition.

* Note that the backdrop will only stay completely fixed for the
  backdrop transition combination `reveal`/`conceil`. For all other
  combinations the backdrop will start scrolling soon as the section
  has completely entered the viewport. This is an arbitrary choice
  which has been made when designing the transition effects.

## Storybook

The storybook entries below `frontend/Motif Area/Playground` use
different combinations of the factors that influence motif area
related backdrop and content positioning. They can be use to quickly
compare different scenarios.

## Background Positioning

When the section has full height, the backdrop will eventually cover
the whole viewport. We can choose a background position that centers
the motif area in the viewport as much as possible. Since we want the
backdrop to cover the viewport, the motif area will still be
off-center if it is located at the margin of the asset. For the same
reason, large motif areas will not fit inside the viewport completely.
See code comments for `useBackgroundFile` and its tests for more
details.

## Section Min Height/Content Padding

For dynamic height sections with little or no content, we need to take
extra steps to ensure that the motif area can become visible. The
section obviously needs to be at least as high as the motif area.

If content and motif area do not fit side by side, we shift the
content down such that the content does not intersect the motif area
initially.

For an overview of cases, look at the code comments and tests of the
`useMotifAreaState` hook.

## Backdrop Translation (Not Implemented)

When choosing min height and content padding for dynamic height
sections, we can take different approaches to ensure that the motif
area can be seen.

As explained above, we still want to scale the backdrop asset to cover
the viewport even if the section itself is not tall enough to cover
the viewport. This is achieved by giving the backdrop height `100vh`
even inside short sections. Due to the way the transition CSS works,
the backdrop will be positioned either fixed at the top of the
viewport (`reveal`/`conceal`), sticky at the top of the section
(`scrollIn`/`scrollOut`, `scrollIn`/`conceal`) or sticky at the bottom
of the section (`reveal`/`scrollOut`).

In the fixed case, making sure that the section has at least motif
area height is enough to ensure that the motif area will become
visible once the section passes the corresponding part of the
background.

In the other cases, there is actually one more background positioning
parameter we could choose to tweak: The position of the viewport sized
backdrop inside the short section.

Consider the following picture

```
..........ooooo
..........ooooo
..........ooXoo
..........:::::
..........:::::
```

where

- `o` cells represent parts of the image that are visible inside the
  section.
- `:` cells represent parts of the image that are cropped by the
  section.
- `.` cells represent parts of the image that are cropped by the
  viewport.
- `X` cells represent the motif area of the image

Assume, in the depicted situation, a short section (represented by the
`o` cells) with `scrollIn` transition has been scrolled to top of the
viewport (represented by the `o` and `:` cells). The section does not
cover the whole viewport. So parts of the next section (area occupied
by `:` cells) are already visible.

The background image has been aligned with position `100% 50%` inside
the viewport sized backdrop to center the motif area (`X`).

If the section does not have content, we could set its min height to
the sum of the motif area's offset top inside the backdrop and the
motif area height to obtain the above result.

In contrast, setting only the motif area height as section min height
would result in situation like:

```
..........ooooo
..........:::::
..........::x::
..........:::::
..........:::::
```

with no way to scroll the motif area into view.

By translating the backdrop inside the section, we could choose to
center the motif area vertically in the section:

```
..........:::::
..........:::::
..........ooXoo
..........:::::
..........:::::
```

One could argue that this is an improvement since it saves space by
cropping the inessential parts of the image above the motif area.

Similarly, if the section has content that fits next to the motif
area, without backdrop translation, a `scrollIn` section will end up
taller than required (`=` cells represents part of the image that are
covered by content):

```
oo=======oooooo
ooooooooooooooo
ooooooooooooXoo
ooooooooooooXoo
:::::::::::::::
```

In contrast, if the backdrop could be translated, content and motif
area could be placed side by side:

```
:::::::::::::::
:::::::::::::::
oo=======oooXoo
ooooooooooooXoo
:::::::::::::::
```

Note that backdrop translation has a different effect than just
setting the backdrop height to equal the section height. In the above
protrait viewport examples, the image is both vertically and
horizontally cropped to center the motif area in the section while
keeping a scale factor that only depends on the viewport dimension.

Along the same lines, a `reveal`/`scrollOut` needs to choose a greater
min height to ensure the section can be revealed far enough instead of
translating the backdrop down such that revealing the backdrop
immediately also reveals the motif area.

### Downsides

Pageflow Scrolled currently does not use backdrop translation, because
of the following challange:

The allowed amount of backdrop translation depends on the section's
content height.

Since we always want the backdrop to cover the section, we can only
translate the backdrop up until its lower edge aligns with the lower
edge of the section.

If, in the above example, the content height is greater than the motif
area height, the amount by which we can translate the backdrop decreases:

```
without             with
translation:        translation:

oo=======oooooo     :::::::::::::::
oo=======oooooo     oo=======oooooo
oo=======oooXoo     oo=======oooXoo
ooooooooooooXoo     oo=======oooXoo
:::::::::::::::     :::::::::::::::
```

In cases where the content height still below the motif area, backdrop
translation could also work in combination with content that has been
padded to prevent intersecting the motif area:

```
without             with
translation:        translation:

ooooooooooooooo     :::::::::::::::
ooooooooooooooo     :::::::::::::::
ooooXoooooooooo     ooooXoooooooooo
oo=======oooooo     oo=======oooooo
:::::::::::::::     :::::::::::::::
```

Soon as the there is more content than can be displayed below the
motif area, the backdrop needs to be able to cover the viewport. No
backdrop translation is possible (`-` cells off screen parts of the
content that will be scrolled in once the section has completely
entered the viewport):

```
ooooooooooooooo
ooooooooooooooo
ooooXoooooooooo
oo=======oooooo
oo=======oooooo
  -------
  -------
```

Since content height can change while viewing the entry (lazy loaded
content, expandable elements etc.), the updates would need to be
triggered by something like a resize observer.

To limit complexity, we have chosen the simpler approach of increasing
the min height and wait until concrete use cases illustrate the need
for more.

# Media Autoplay Behavior

## Browsers with Global Autoplay Unlock

Autoplay is disabled as long as the user has not yet interacted with
the page. Clicking anywhere inside the page, allows autoplay from that
point on. Firefox also displays a notification to the user once
autoplay is attempted which allows enabling autoplay right away.

* Chrome >= 66
* Firefox >= 64 (as of writing only available as nightly)

### Autoplay Video Page

#### When Activated as First Page

- Attempts to autoplay with sound and fails
- Plays video muted
- Sets background media to muted

#### When Activated after Background Media is Already Muted

- Plays video muted

#### When Playing while Background Media is Unmuted

- Unmutes the video

#### When Play Button is Clicked while Background Media Muted

- Unmutes background media
- Starts playing



### Page with Background Video

Apart from not having player controls, behaves exactly like autoplay
video page.



### Autoplay Audio Page

#### When Activated as First Page

- Attempts to autoplay and fails
- Displays play button with control bar text (i.e. "Start audio now")
- Sets background media to muted

#### When Activated after Background Media is Already Muted

- Does not attemp to autoplay
- Displays play button with controls bar text

#### When Active while Background Media is Unmuted

- Starts playing

#### When Play Button is Clicked while Background Media Muted

- Unmutes background media
- Starts playing



### Non-Autoplay Video/Audio Pages

- Play if and only if the play button is clicked
- Clicking the play button unmutes background media



### Page with Atmo Audio

#### When Activated as First Page

- Attempts to autoplay atmo and fails
- Sets background media to muted

#### When Activated after Background Media is Already Muted

- Does not start atmo

#### When Active while Background Media is Unmuted

- Starts playing atmo




## Browsers with per Element Autoplay Unlock

Each video and audio element needs to be unlocked by a user gesture
individually to allow unmuted autoplay.

* Safari >= 11
* Mobile Safari
* Chrome on iOS
* Chrome on Android

### Audio/Video Page

- Autoplay is disabled
- Displays play button with control bar text
- Clicking the play button plays the media unmuted

### Page with Background Video

- Background video autoplays muted

### Page with Atmo Audio

- Atmo disabled on mobile browsers

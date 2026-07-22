# Site Redesign — Feedback & Requested Changes

Overall the current look is good — keep the general vibe and design direction. The items below are the changes to make.

## 1. Accessibility & Contrast

The body/paragraph font is a light burnt orange on a dark burnt orange background, which is a little difficult to read. Instead of a 4.5:1 contrast ratio, double it (target ~9:1).

## 2. Mobile Optimization

Think about how things are organized on each page and how to simplify some of the information. Everything must look good on mobile.

## 3. Click-to-Copy Instead of Click-to-Save

In the step 1 / step 2 / step 3 flow, users start with a base template. Instead of clicking on it to save it, clicking should copy it so they can paste it directly into ChatGPT. Same for the hero character reference images just below — clicking should copy the image to the clipboard for pasting.

## 4. Tighter On-Screen Organization

Organize things more tightly so users don't have to click through to another screen. Arrange the cards into two rows of three that slide left and right, so users can scroll through the images horizontally. This makes the mobile experience better.

## 5. Get Straight to the Point on Each Page

Don't explain everything in depth. Present the steps as 1, 2, 3:

1. Copy the UI image into ChatGPT.
2. Copy the hero style into ChatGPT (don't worry — it doesn't matter too much who you pick).
3. Copy this prompt, fill out the information, paste it into ChatGPT, and hit Go.

Let users complete the steps on each page rather than having to click around a bunch.

## 6. Home Screen

The home screen should feature three different image types:

- **Hero character image** — with hero name
- **Custom image** — make any kind of hero image you want (e.g., group hero image)
- **Unique hero image**

Briefly explain how the site works — it's real simple: the user clicks one of the three options and it takes them to that page. Each page has:

- Brief instructions at the top
- A dropdown to see an example — a screenshot of what it looks like adding images and a prompt to a ChatGPT conversation
- A hero banner with a collage of example images

The first action the user takes must be on the first screen or within the first scroll. Apply this same pattern across all three image types.

## 7. One-Paste Copy (Investigate — Optional)

Investigate whether users could fill out the prompt, select the images they want, and with one button copy everything — a single paste into ChatGPT rather than pasting one image, going back, pasting another, going back, pasting the prompt, etc. If it's not possible, skip it.

Note: the clipboard API can't hold multiple separate images plus text in one payload, but two approaches worth testing:
- Copy a single composite image (canvas-stitched) plus the prompt text
- Copy an HTML clipboard payload with embedded images + text, and test whether ChatGPT accepts it in one paste

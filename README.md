Danbooru EX is a userscript that adds a variety of enhancements and new features to Danbooru, making it faster and easier to use.

# Demos

<a href="https://gfycat.com/VelvetyWeakKangaroo">
  <h4>Thumbnail Previews</h4>
  <img src="https://i.imgur.com/g8uobRM.gif">
</a>

<a href="https://gfycat.com/FamousPastItalianbrownbear">
  <h4>Preview Mode</h4>
  <img src="https://i.imgur.com/0IoelYp.gif">
</a>

<a href="https://gfycat.com/AnyNewIrukandjijellyfish">
  <h4>Tag Scripting</h4>
  <img src="https://i.imgur.com/ICjGo9n.gif">
</a>

# Installation

Chrome: [Install Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)

Firefox: [Install Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

Install the script: https://github.com/evazion/danbooru-ex/raw/stable/dist/danbooru-ex.user.js

To configure the script, go to My Account > Settings > EX Settings, or click the Settings link at the very bottom of the page.

# Main features

* Search bar and mode menu available on every page.

* [Thumbnail previews](https://gfycat.com/VelvetyWeakKangaroo): hover over any thumbnail or post #1234 link to popup a large image preview.

* [Preview panel](https://gfycat.com/FamousPastItalianbrownbear): Select Preview from the Mode menu then click a thumbnail. A panel will appear showing you the full post without leaving the page.

* [Redesigned tag script mode](https://gfycat.com/AnyNewIrukandjijellyfish): Clicking thumbnails selects the post and opens a preview instead of applying tags immediately. After your posts are selected, click Apply or press Shift+A to apply tags. This helps you avoid mistagging posts, lets you select posts in bulk, and lets you see the full image as you work.

* [Resizeable tag sidebar](https://fat.gfycat.com/ShadowySecondaryIslandcanary.webm): collapse it to get more space, or expand it to read long tags that normally wrap around the tag list.

* [Colorized tags in the wiki and in the forum](https://i.imgur.com/6KtblP7.png).

* [Visible comment scores and extra post info](https://i.imgur.com/nAMMxFe.png).

## All features

#### Sidewide:

* Fixed times ("2016-08-10") are replaced with relative times ("3 months ago").
* Search box, tag scripting, and post preview mode are available everywhere.

#### /artists:

* The /artists index is redesigned to make it easier to search and to see recent changes.
* [Screenshot](https://i.imgur.com/ZvhB6bF.png)

#### /comments:

* Posts show more info: number of favorites, image size, and post number.
* Tags are ordered by type: artists, copyrights, characters, general.
* Comment scores are shown.
* [Screenshot](https://i.imgur.com/nAMMxFe.png)

#### /forum_posts:

* [Hovering over post #1234 links shows a post preview](https://i.imgur.com/t6iuKvx.png).
* DText links to wiki pages (e.g. [[touhou]]) are colorized by copyright, character, or artist.

#### /posts:

* [Hovering over a thumbnail shows a larger preview](https://gfycat.com/VelvetyWeakKangaroo).
* [The sidebar is resizeable](https://fat.gfycat.com/ShadowySecondaryIslandcanary.webm).

#### /posts/1234:

* Artist tags are moved to the top of the tag list.
* Hotkeys are added to rate posts and upvote/downvote.
* [Note editing has live, as-you-type preview](https://gfycat.com/DeficientInconsequentialCottontail).
* Autoplay of webm/mp4 posts can be disabled by default.
* video_with_sounds posts may be muted or have looping disabled by default.

#### /post_versions

* [Post thumbnails are displayed, to make checking edits easier](https://i.imgur.com/fNGNKxh.png).

#### /users/1234

* [Upload, favorite, and saved search sections have a button to show more posts](https://gfycat.com/ImpartialEverlastingIceblueredtopzebra).
* Sections may be collapsed to be hidden.

#### /wiki_pages:

* DText links to wiki pages (e.g. [[touhou]]) are colorized by copyright, character, or artist, and have tooltips showing the post count and the tag's age.
* Bad links (links to empty tags or tags that don't exist, e.g. [[miku hatsune]]) are underlined.
* Wiki headings can be collapsed to hide long tag lists.
* [Long wiki pages have an autogenerated table of contents](https://i.imgur.com/MNTdgLa.png).

# Usage

### Preview mode

* Choose Preview from the Mode menu or press ~ (tilde) to enter Preview mode.
* In Preview mode clicking a thumbnail opens the full image in the preview panel on the right side of the screen.
* Press Escape or ~ again to leave Preview mode.
* The preview panel can be resized by dragging the edge.

### Tag script mode

* Choose Tag Script from the Mode menu or press a number key (1-9) to switch to a tag script.
* Click thumbnails to select/deselect them, then click 'Apply' or press `Shift+A` to apply tags to selection.
* Drag and highlight to select multiple thumbnails at once.
* Use Ctrl+A to select all or select none.
* Use Ctrl+I to invert selection.
* Press number key twice to focus tag script box.
* Press Escape to leave Tag Script mode.

## Keyboard Shortcuts

### Sitewide

* Escape: Close popup notices.
* Shift+1..9: Jump to page 1..9.
* Shift+0: Jump to last page.
* Ctrl+Enter: Submit comment / forum post / wiki entry.

### Searchbar

* Shift+Q: Focus search box.
* Ctrl+Enter: Open search in new tab.

### Mode menu

* ~ (tilde): Enter preview mode. Press again to exit.
* 1, 2, ... 9: Enter tag script mode with tag script #1, #2, etc. Press again
  to focus tag script box.
* Escape: Exit tag script mode or preview mode.

### Tag script mode

* Shift+A: Apply tag script to selected thumbnails.
* Ctrl+A: Toggle between select all and select none.
* Ctrl+I: Invert selection.

### /artists/1234

* E: Edit artist.

### /pools/1234

* E: Edit pool.

### /posts/1234

* Alt+S: Rate safe.
* Alt+Q: Rate questionable.
* Alt+E: Rate explicit.
*     U: Upvote.
* Alt+U: Downvote.

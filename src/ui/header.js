import ModeMenu from "./mode_menu.js";

export default class Header {
  static initialize() {
    Header.initializeHeader();
    Header.initializeHotkeys();

    EX.config.replaceModeMenu && Header.initializeModeMenu();
  }

  static initializeHeader() {
    let $header = $(`
      <header id="ex-header" class="ex-fixed">
        <h1><a href="/">Danbooru</a></h1>

        <form class="ex-search-box" action="/posts" accept-charset="UTF-8" method="get">
          <input type="text" name="tags" id="tags" class="ui-autocomplete-input" autocomplete="off">
          <input type="submit" value="Go">
        </form>

        <section class="ex-mode-menu" style="display: none">
          <label for="mode">Mode</label>
          <select name="mode">
            <option value="view">View</option>
            <option value="preview">Preview</option>
            <option value="tag-script">Tag script</option>
          </select>

          <fieldset class="ex-tag-script-controls" style="display: none">
            <select name="tag-script-number">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>

            <input name="tag-script" type="text" placeholder="Enter tag script">
            <button name="apply" type="button">Apply</button>

            <label>Select</label>
            <button name="select-all" type="button">All/None</button>
            <button name="select-invert" type="button">Invert</button>
          </fieldset>
        </section>

	<a class="ex-header-close-button">
          <i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
	</span>
      </header>
    `).insertBefore("#top");

    // Initalize header search box.
    $("#ex-header #tags").val($("#sidebar #tags").val());
    Danbooru.Autocomplete.initialize_all();

    let $close = $(".ex-header-close-button");
    $close.click(event => {
      if ($header.hasClass("ex-fixed")) {
        $header.slideUp().promise().then(e => {
          $header.removeClass("ex-fixed").show();
          $close.find("i").removeClass("fa-times-circle").addClass("fa-thumb-tack");
        });
      } else {
        $header.addClass("ex-fixed");
        $close.find("i").addClass("fa-times-circle").removeClass("fa-thumb-tack");
      }

      event.preventDefault();
    });
  }

  static initializeHotkeys() {
    // Shift+Q: Focus and search box.
    $(document).keydown('shift+q', e => {
      // Add a space to end if box is non-empty and doesn't already have trailing space.
      let $input = $("#ex-header #tags").first();
      $input.val().length && $input.val((i, v) => v.replace(/\s*$/, ' '));
      // $input.focus().selectRange(0, $input.val().length);

      e.preventDefault();
    });
  }

  static initializeModeMenu() {
    $(".ex-mode-menu").show();
    ModeMenu.initialize();
  }
}
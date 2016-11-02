import Artists      from "./ui/artists.js";
import Comments     from "./ui/comments.js";
import ForumPosts   from "./ui/forum_posts.js";
import Header       from "./ui/header.js";
import ModeMenu     from "./ui/mode_menu.js";
import Pools        from "./ui/pools.js";
import Posts        from "./ui/posts.js";
import PostVersions from "./ui/post_versions.js";
import Users        from "./ui/users.js";
import WikiPages    from "./ui/wiki_pages.js";

import Tag from "./tag.js";

export default class UI {
  static initialize() {
    UI.initialize_moment();
    UI.initialize_patches();

    EX.config.showThumbnailPreviews && UI.initialize_post_thumbnail_previews();
    EX.config.showPostLinkPreviews && UI.initialize_post_link_previews();
    EX.config.usernameTooltips && UI.initialize_user_links();
    EX.config.styleWikiLinks && UI.initialize_wiki_links();
    EX.config.useRelativeTimestamps && UI.initialize_relative_times();
    EX.config.resizeableSidebars && UI.initialize_resizeable_sidebar();
    EX.config.previewPanel && UI.initialize_preview_panel();
    UI.initialize_hotkeys();
  }

  // Prevent middle-click from adding tag when clicking on related tags (open a new tab instead).
  static initialize_patches() {
    const old_toggle_tag = Danbooru.RelatedTag.toggle_tag;
    Danbooru.RelatedTag.toggle_tag = function (e) {
      if (e.which === 1) {
        return old_toggle_tag(e);
      }
    };
  }

  // Use relative times everywhere.
  static initialize_relative_times() {
    const ABS_DATE = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/;
    const abs_dates = $('time').filter((i, e) => $(e).text().match(ABS_DATE));

    abs_dates.each((i, e) => {
      const time_ago = moment($(e).attr('datetime')).fromNow();
      $(e).text(time_ago);
    });
  }

  static initialize_moment() {
    moment.locale("en-short", {
      relativeTime : {
          future: "in %s",
          past:   "%s",
          s:  "s",
          m:  "1m",
          mm: "%dm",
          h:  "1h",
          hh: "%dh",
          d:  "1d",
          dd: "%dd",
          M:  "1m",
          MM: "%dm",
          y:  "1y",
          yy: "%dy"
      }
    });

    moment.locale("en");
    moment.defaultFormat = "MMMM Do YYYY, h:mm a";
  }

  // Show post previews when hovering over post #1234 links.
  static initialize_post_link_previews() {
    $('a[href^="/posts/"]')
      .filter((i, e) => /post #\d+/.test($(e).text()))
      .addClass('ex-thumbnail-tooltip-link');

    UI.install_tooltips();
  }

  // Show post previews when hovering over thumbnails.
  static initialize_post_thumbnail_previews() {
    // The thumbnail container is .post-preview on every page but comments and
    // the mod queue. Handle those specially.
    if ($("#c-comments").length) {
      $("#c-comments .post-preview .preview img").addClass('ex-thumbnail-tooltip-link');
    } else if ($("#c-post-moderator-queues").length) {
      $("#c-post-moderator-queues .mod-queue-preview aside img").addClass('ex-thumbnail-tooltip-link');
    } else {
      $(".post-preview img").addClass('ex-thumbnail-tooltip-link');
    }

    UI.install_tooltips();
  }

  static install_tooltips(items) {
    const max_size = 450;

    $(".ex-thumbnail-tooltip-link").tooltip({
      items: "*",
      content: `<div style="width: ${max_size}px; height: ${max_size}px"></div>`,
      show: { delay: EX.config.thumbnailPreviewDelay },
      position: {
        my: "left+10 top",
        at: "right top",
      },
      open: (e, ui) => {
        try {
          // XXX should instead disable thumbnails when preview panel is open.
          if (ModeMenu.getMode() === "preview" || ModeMenu.getMode() === "tag-script") {
            $(ui.tooltip).css({ visibility: "hidden" });
            return;
          }

          let $e = $(e.target);
          let $link = $e;

          // XXX hack
          if ($e.prop("nodeName") === "IMG") {
            $link = $e.closest("a");
          }

          const id = $link.attr('href').match(/\/posts\/(\d+)/)[1];

          // XXX avoid lookup on tooltip open.
          $.getJSON(`/posts/${id}.json`).then(post =>
            $(ui.tooltip).html(Posts.preview(post, post.large_file_url, "ex-thumbnail-tooltip"))
          );
        } catch (e) {
          console.log(e);
        }
      }
    });
  }

  // Add tooltips to usernames. Also add data attributes for custom CSS styling.
  static initialize_user_links() {
    const user_ids =
      _($('a[href^="/users"]').filter((i, e) => !$(e).text().match(/My Account/)))
      .map(e => $(e).attr('href').replace("/users/", ""))
      .map(Number)
      .sortBy()
      .sortedUniq()
      .join(',');

    if (user_ids.length === 0) {
      return;
    }

    // XXX should do lookup in batches.
    $.getJSON(`/users.json?limit=1000&search[id]=${user_ids}`).then(users => {
      for (const user of users) {
        let $user = $(`a[href^="/users/${user.id}"]`);

        _(user).forOwn((value, key) =>
          $user.attr(`data-${_(key).kebabCase()}`, value)
        );

        let privileges =
          user.level_string +
          (user.is_banned         ? " Banned"      : "") + 
          (user.is_super_voter    ? " Supervoter"  : "") +
          (user.can_approve_posts ? " Approver"    : "") +
          (user.can_upload_free   ? " Contributor" : "");

        let tooltip =
          `${user.name} (${privileges}) - joined ${moment(user.created_at).fromNow()}`;

        $user.attr("title", tooltip);
      }
    });
  }

  // Color code tags linking to wiki pages. Also add a tooltip showing the tag
  // creation date and post count.
  static initialize_wiki_links() {
    function parse_tag_name(wiki_link) {
      return decodeURIComponent($(wiki_link).attr('href').match(/^\/wiki_pages\/show_or_new\?title=(.*)/)[1]);
    }

    const meta_wikis = /^(about:|disclaimer:|help:|howto:|list_of|pool_group:|tag_group:|template:)/i;

    const $wiki_links =
      $(`a[href^="/wiki_pages/show_or_new?title="]`)
      .filter((i, e) => $(e).text() != "?");

    const tag_names =
      _($wiki_links.toArray())
      .map(parse_tag_name)
      .reject(tag => tag.match(meta_wikis))
      .value();

    // Fetch tag data for each batch of tags, then categorize them and add tooltips.
    Tag.search(tag_names).then(tags => {
      $wiki_links.each((i, e) => {
        const $wiki_link = $(e);
        const name = parse_tag_name($wiki_link);
        const tag = tags[name];

        if (name.match(meta_wikis)) {
          return;
        } else if (tag === undefined) {
          $wiki_link.addClass('tag-dne');
          return;
        }

        const tag_created_at = moment(tag.created_at).format('MMMM Do YYYY, h:mm:ss a');

        const tag_title =
          `${Tag.Categories[tag.category]} tag #${tag.id} - ${tag.post_count} posts - created on ${tag_created_at}`;

        _(tag).forOwn((value, key) =>
          $wiki_link.attr(`data-tag-${_(key).kebabCase()}`, value)
        );

        $wiki_link.addClass(`tag-type-${tag.category}`).attr('title', tag_title);

        if (tag.post_count === 0) {
          $wiki_link.addClass("tag-post-count-empty");
        } else if (tag.post_count < 100) {
          $wiki_link.addClass("tag-post-count-small");
        } else if (tag.post_count < 1000) {
          $wiki_link.addClass("tag-post-count-medium");
        } else if (tag.post_count < 10000) {
          $wiki_link.addClass("tag-post-count-large");
        } else if (tag.post_count < 100000) {
          $wiki_link.addClass("tag-post-count-huge");
        } else {
          $wiki_link.addClass("tag-post-count-gigantic");
        }
      });
    });
  }

  static initialize_resizeable_sidebar() {
    if ($("#sidebar").length === 0) {
      return;
    }

    let controller = $("#page > div:nth-child(2)").attr("id");
    let action     = $("#page > div:nth-child(2) > div").attr("id");
    const width = EX.config.sidebarState[`${controller} ${action}`] || EX.config.defaultSidebarWidth;

    $("#sidebar").addClass("ex-panel").width(width).after(`
      <section id="ex-sidebar-resizer" class="ex-vertical-resizer">
        <div class="ex-vertical-resizer-line"></div>
      </section>
    `);

    // XXX fix magic numbers (28 = 2em).
    const drag = function (e, ui) {
      $("#sidebar").width(ui.position.left - 28);
    }

    const stop = function (e, ui) {
      let state = EX.config.sidebarState;
      state[`${controller} ${action}`] = ui.position.left - 28;
      EX.config.sidebarState = state;
    };

    $("#ex-sidebar-resizer").draggable({
      axis: "x",
      helper: "clone",
      drag: _.throttle(drag, 16),
      stop: _.debounce(stop, 100),
    });
  }

  static initialize_preview_panel() {
    let $container = $(`
      #c-posts #content,
      #c-notes #a-index,
      #c-pools #a-gallery,
      #c-pools #a-show,
      #c-comments #a-index,
      #c-moderator-post-queues #a-show
    `);

    if ($container.length === 0) {
      return;
    }

    $container.parent().css({ display: "flex" });
    $container.addClass("ex-preview-panel-container");
    $container.after(`
      <section id="ex-preview-panel-resizer" class="ex-vertical-resizer">
        <div class="ex-vertical-resizer-line"></div>
      </section>
      <section id="ex-preview-panel" class="ex-panel">
        <div>
          <img>
        </div>
      </section>
    `);

    const origTop = $("#ex-preview-panel > div").offset().top;
    const headerHeight = $("#ex-header").height();
    const footerHeight = $("footer").outerHeight(true);

    const onScroll = function (event) {
      let height;

      if (window.scrollY + headerHeight >= origTop) {
        $("#ex-preview-panel > div").addClass("ex-fixed").css({ top: headerHeight });
        height = `calc(100vh - ${headerHeight}px - 1em)`;
      } else {
        $("#ex-preview-panel > div").removeClass("ex-fixed");
        height = `calc(100vh - ${origTop - window.scrollY}px - 1em)`;
      }

      if (window.scrollY + footerHeight >= $("body").height() - window.innerHeight) {
        const diff = window.scrollY + footerHeight - $("body").height() + window.innerHeight;
        height = `calc(100vh - ${headerHeight}px - ${diff}px)`;
      }

      $("#ex-preview-panel > div").css({ height });
    };

    $(document).scroll(_.throttle(onScroll, 16));

    $("#ex-preview-panel-resizer").draggable({
      axis: "x",
      helper: "clone",
      drag: (event, ui) => {
        const width = $("body").innerWidth() - ui.position.left - 28;

        $("#ex-preview-panel").width(width);
        $("#ex-preview-panel > div").width(width);
        // $("#ex-preview-panel .ex-sticky img").css({ "max-width": width });
      },
      // stop: (event, ui) => { EX.config.editPanelWidth = ui.position.left - 28 },
    });
  }

  /*
   * Global keybindings.
   * - Escape: Close notice popups.
   * - W: Smooth scroll up.
   * - S: Smooth scroll down.
   * - Shift+Q: Focus top search bar.
   */
  static initialize_hotkeys() {
    // Escape: Close notice popups.
    $(document).keydown('esc', e => $('#close-notice-link').click());

    // Escape: Unfocus text entry field.
    $('#tag-script-field').attr('type', 'text');
    $('input[type=text],textarea').keydown('esc', e => $(e.target).blur());

    UI.initialize_scroll_hotkeys();

    if ($(".paginator").length) {
      UI.initialize_paginator_hotkeys();
    }
  }

  static initialize_scroll_hotkeys() {
    let scroll = (direction, duration, distance) =>
      _.throttle(() => {
        const top = $(window).scrollTop() + direction * $(window).height() * distance;
        $('html, body').animate({scrollTop: top}, duration, "linear");
      }, duration);
    /*
    Danbooru.Shortcuts.nav_scroll_down =
        () => Danbooru.scroll_to($(window).scrollTop() + $(window).height() * 0.15);
    Danbooru.Shortcuts.nav_scroll_up =
        () => Danbooru.scroll_to($(window).scrollTop() - $(window).height() * 0.15);
    */

    // Enable smooth scrolling with W/S keys.
    Danbooru.Shortcuts.nav_scroll_down = scroll(+1, 50, 0.06);
    Danbooru.Shortcuts.nav_scroll_up   = scroll(-1, 50, 0.06);
  }

  /*
   * Shift+1..9: Jump to page N.
   * Shift+0: Jump to last page.
   */
  static initialize_paginator_hotkeys() {
    // Add paginator above results.
    // $('.paginator').clone().insertBefore('#post-sections');

    /* Shift+1..9: Jump to page N. */
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(n =>
      $(document).keydown(`shift+${n}`, e => {
        UI.gotoPage(n);
        e.preventDefault();
      })
    );

    // Shift+0: Switch to last page if there is one.
    $(document).keydown(`shift+0`, e => {
      e.preventDefault();

      // a:not(a[rel]) - exclude the Previous/Next links seen in the paginator on /favorites et al.
      const last_page = $('div.paginator li:nth-last-child(2) a:not(a[rel])').first().text();

      if (last_page) {
        UI.gotoPage(last_page);
      }
    });
  }

  static linkTo(name, path = "/", params = {}, ...classes) {
    const query = $.param(params);
    const href = (query === "")
               ? path
               : path + "?" + query;

    return `<a class="${_.escape(classes.join(" "))}" href="${href}">${_.escape(name)}</a>`;
  }

  static query(param) {
    return new URL(window.location).searchParams.get(param);
  }

  static openEditPage(controller) {
    // FIXME: Get the ID from the 'Show' link. This is brittle.
    const $show_link =
      $('#nav > menu:nth-child(2) a')
      .filter((i, e) => $(e).text().match(/^Show$/));

    const id = $show_link.attr('href').match(new RegExp(`/${controller}/(\\d+)$`))[1];

    window.location.href = `/${controller}/${id}/edit`;
  }

  // Go to page N.
  static gotoPage(n) {
    if (location.search.match(/page=(\d+)/)) {
      location.search = location.search.replace(/page=(\d+)/, `page=${n}`);
    } else {
      location.search += `&page=${n}`;
    }
  }
}

UI.Artists = Artists;
UI.Comments = Comments;
UI.ForumPosts = ForumPosts;
UI.Header = Header;
UI.ModeMenu = ModeMenu;
UI.Pools = Pools;
UI.Posts = Posts;
UI.PostVersions = PostVersions;
UI.Users = Users;
UI.WikiPages = WikiPages;

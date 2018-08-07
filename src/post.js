import _ from "lodash";
import Resource from "./resource.js";

export default Resource.Post = class Post extends Resource {
  static get primaryKey() { return "post"; }

  static tags(post) {
    let split_tag_string = (tag_string, category) => {
      return tag_string.split(/\s+/).filter(String).map(name => ({ name, category }));
    }

    return _.concat(
      split_tag_string(post.tag_string_artist, 1),
      split_tag_string(post.tag_string_copyright, 3),
      split_tag_string(post.tag_string_character, 4),
      split_tag_string(post.tag_string_meta, 5),
      split_tag_string(post.tag_string_general, 0),
    );
  }

  static update(postId, tags) {
    return this.put(postId, { "post[old_tag_string]": "", "post[tag_string]": tags });
  }

  get source_domain() {
    try {
      return new URL(this.source).hostname;
    } catch (_e) {
      return "";
    }
  }

  get pretty_rating() {
    switch (this.rating) {
      case "s": return "safe";
      case "q": return "questionable";
      case "e": return "explicit";
    }
  }
}

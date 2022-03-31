export default function stringReplacement(string) {
  return string
    .replace(
      /(\[(.*?)\])\((https?\:\/\/.*?)\)/g,
      '<a href="$3" target="_blank">$2</a>'
    )
    .replace(/(?:\*)\*(.*?)\*(?:\*)/g, "<b>$1</b>")
    .replace(/^\*(?!\s)(.+)(?:\*)/gm, "<i>$1</i>")
    .replace(/\\?\\?(#([a-zа-яё0-9_\\]+))/gi, '<a href="/tag/$2">$1</a>');
}

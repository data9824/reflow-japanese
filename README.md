# reflow-japanese for Atom

Reflows and wraps texts based on the Japanese line breaking rules. Alphabet words, indents, and markdown lists are taken into account when formatting. By default, just press Shift+Enter on a text.

日本語禁則処理に従ってテキストを折り返します。整形の際には、アルファベットの単語やインデント、Markdownリストも考慮されます。デフォルト設定では、テキストの上でShift+Enterを押してください。

If pressing Shift+Enter causes default line break, you can open Settings, or Preferences, of Atom, select Keybinings, open your keymap file, then add the following lines to the file.

Shift+Enterを押しても改行されてしまう場合は、AtomのSettings(Preferences)より、Keybindingsを選び、your keymap fileを開いて、以下の行を追加してください。

```
'atom-workspace atom-text-editor:not([mini])':
  'shift-enter': 'reflow-japanese:reflow'
```

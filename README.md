# reflow-japanese for Atom

![Screenshot](https://raw.githubusercontent.com/data9824/reflow-japanese/master/screenshot.gif)

Reflows and wraps texts based on the Japanese line breaking rules. Alphabet words, indents, C++ and C style comments, and markdown lists are taken into account when formatting. By default, just press Shift+Enter on a text.

日本語禁則処理に従ってテキストを折り返します。整形の際には、アルファベットの単語やインデント、C++やC形式コメント、Markdownリストも考慮されます。デフォルト設定では、テキストの上でShift+Enterを押してください。

If pressing Shift+Enter causes default line break, you can open Settings, or Preferences, of Atom, select Keybinings, open your keymap file, then add the following lines to the file.

Shift+Enterを押しても改行されてしまう場合は、AtomのSettings(Preferences)より、Keybindingsを選び、your keymap fileを開いて、以下の行を追加してください。

```
'atom-workspace atom-text-editor:not([mini])':
  'shift-enter': 'reflow-japanese:reflow'
```

## License

[![CC0](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, the person who associated CC0 with this work has waived all copyright and related or neighboring rights to this work.

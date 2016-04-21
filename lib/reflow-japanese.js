'use babel';

import { CompositeDisposable, Range, Point } from 'atom';

function isSpace(ch) {
	return (ch === ' ' || ch === '\t');
}

function isLatin(ch) {
	return (ch.charCodeAt(0) < 0x02B0);
}

export default {

	config: {
		lineLength: {
			'type': 'integer',
			'default': 74,
			'minimum': 1,
			'title': 'Line Length',
		    'description': 'Lines are wrapped in this width.',
		},
	},

	subscriptions: null,

	activate(state) {
		this.subscriptions = new CompositeDisposable();
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'reflow-japanese:reflow': () => this.reflow()
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	reflow() {
		let lineLength = atom.config.get('reflow-japanese.lineLength');
		if (editor = atom.workspace.getActiveTextEditor()) {
			let point = editor.getCursorBufferPosition();
			let grammar = this.detectGrammar(point);
			let lineText = editor.lineTextForBufferRow(point.row);
			let range;
			let hasNextLine = (point.row + 1 < editor.getLineCount());
			if (hasNextLine && lineText.match(/^\s*$/) !== null) {
				editor.setCursorBufferPosition(new Point(point.row + 1, 0));
				return;
			} else if (hasNextLine && point.column == lineText.length) {
				let nextLineText = editor.lineTextForBufferRow(point.row + 1);
				if (nextLineText.match(/^\s*$/) !== null) {
					editor.setCursorBufferPosition(new Point(point.row + 1, nextLineText.length));
					return;
				}
				range = new Range(new Point(point.row, 0), new Point(point.row + 1, nextLineText.length));
				if (grammar === 'cppcomment') {
					nextLineText = nextLineText.replace(/^\s*\/\/ /, '');
				} else if (grammar === 'ccomment') {
					nextLineText = nextLineText.replace(/^\s*\* /, '');
				} else {
					nextLineText = nextLineText.replace(/^\s*/, '');
				}
				if (lineText.length > 0 && isLatin(lineText.charAt(lineText.length - 1))
					&& nextLineText.length > 0 && isLatin(nextLineText.charAt(0))) {
					lineText += ' ' + nextLineText;
				} else {
					lineText += nextLineText;
				}
			} else {
				range = new Range(new Point(point.row, 0), new Point(point.row, lineText.length));
			}
			let out = this.reflowText(lineText, grammar, editor.getTabLength(), lineLength);
			editor.moveRight();
			editor.setTextInBufferRange(range, out, lineLength);
		}
	},

	isGyotoKinsoku(s) {
		return ("、。，．・？！゛゜ヽヾゝゞ々ー）］｝」』".indexOf(s) >= 0);
	},

	isGyomatsuKinsoku(s) {
		return ("（［｛「『".indexOf(s) >= 0);
	},

	getWidth(s) {
		let width = 0;
		for (let i = 0; i < s.length; ++i) {
			width += isLatin(s.charAt(i)) ? 1 : 2;
		}
		return width;
	},

	detectGrammar(point) {
		let lineText = editor.lineTextForBufferRow(point.row);
		if (lineText.match(/^\s*\* /) !== null) {
			for (let row = point.row - 1; row >= 0; --row) {
				let prevLineText = editor.lineTextForBufferRow(row);
				if (prevLineText.match(/^\s*\/\*/) !== null) {
					return 'ccomment';
				} else if (prevLineText.match(/^\s*\* /) === null) {
					break;
				}
			}
		}
		if (lineText.match(/^\s*[\*\+\-] /) !== null) {
			return 'markdown';
		} else if (lineText.match(/^\s*\/\/ /) !== null) {
			return 'cppcomment';
		} else {
			return 'plaintext';
		}
	},

	reflowText(lineText, grammar, tabLength, lineLength) {
		let match = lineText.match(/^\s*/);
		let indent = (match !== null) ? match[0] : '';
		let indentWidth = 0;
		for (let i = 0; i < indent.length; ++i) {
			indentWidth += (indent.charAt(i) === '\t') ? tabLength : 1;
		}
		lineText = lineText.substr(indent.length);
		let firstIndent;
		if (grammar === 'markdown') {
			let markdown = lineText.match(/^[\*\+\-] /);
			lineText = lineText.substr(2);
			firstIndent = indent + markdown[0];
			indent += '  ';
			indentWidth += 2;
		} else if (grammar === 'cppcomment') {
			lineText = lineText.substr(3);
			indent += '// ';
			firstIndent = indent;
			indentWidth += 3;
		} else if (grammar === 'ccomment') {
			lineText = lineText.substr(2);
			indent += '* ';
			firstIndent = indent;
			indentWidth += 2;
		} else {
			firstIndent = indent;
		}
		let contentWidth = lineLength - indentWidth;
		if (contentWidth <= 0) {
			return;
		}
		let out = "";
		let row = 0;
		let output = (s) => {
			let width = this.getWidth(s);
			if (row !== 0 && row + width > contentWidth) {
				let i;
				for (i = out.length - 1; i >= 0; --i) {
					if (!isSpace(out.charAt(i))) {
						break;
					}
				}
				out = out.substr(0, i + 1);
				if (!this.isGyotoKinsoku(s) || row + width > contentWidth + 2) {
					if (out.length > 0 && this.isGyomatsuKinsoku(out.charAt(out.length - 1))) {
						let lastCh = out.charAt(out.length - 1);
						out = out.substr(0, out.length - 1) + '\n';
						s = lastCh + s;
						width += this.getWidth(lastCh);
					} else {
						out += '\n';
					}
					row = 0;
				}
			}
			if (row === 0 && isSpace(s)) {
				return;
			}
			if (out.length === 0) {
				out += firstIndent;
			} else if (out.charAt(out.length - 1) === '\n') {
				out += indent;
			}
			out += s;
			row += width;
		};
		const STATE_LATIN = 1;
		const STATE_NON_LATIN = 2;
		const STATE_LATIN_SPACE = 3;
		let state = STATE_LATIN;
		let latinWord = "";
		for (let i = 0; i < lineText.length; ++i) {
			let ch = lineText.charAt(i);
			switch (state) {
			case STATE_LATIN:
				if (isSpace(ch)) {
					output(latinWord);
					latinWord = "";
					output(ch);
					state = STATE_LATIN_SPACE;
				} else if (isLatin(ch)) {
					latinWord += ch;
					state = STATE_LATIN;
				} else {
					output(latinWord);
					latinWord = "";
					output(ch);
					state = STATE_NON_LATIN;
				}
				break;
			case STATE_NON_LATIN:
				if (isLatin(ch)) {
					latinWord += ch;
					state = STATE_LATIN;
				} else {
					output(ch);
					state = STATE_NON_LATIN;
				}
				break;
			case STATE_LATIN_SPACE:
				if (isSpace(ch)) {
					output(ch);
					state = STATE_LATIN_SPACE;
				} else if (isLatin(ch)) {
					latinWord += ch;
					state = STATE_LATIN;
				} else {
					output(ch);
					state = STATE_NON_LATIN;
				}
				break;
			}
		}
		output(latinWord);
		return out;
	}

};

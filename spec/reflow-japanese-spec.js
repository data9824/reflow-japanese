'use babel';

import ReflowJapanese from '../lib/reflow-japanese';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('ReflowJapanese', () => {
	beforeEach(() => {
	});
	describe('reflowText', () => {
		it('keeps an empty line', () => {
			expect(ReflowJapanese.reflowText('', 'plaintext', 4, 8)).toEqual('');
		});
		it('keeps an indent', () => {
			expect(ReflowJapanese.reflowText('\t ', 'plaintext', 4, 8)).toEqual('\t ');
		});
		it('breaks a line with a tab and space indent', () => {
			expect(ReflowJapanese.reflowText('\t 678 0', 'plaintext', 4, 8)).toEqual('\t 678\n\t 0');
		});
		it('keeps a short line', () => {
			expect(ReflowJapanese.reflowText(' 234 678', 'plaintext', 4, 8)).toEqual(' 234 678');
		});
		it('breaks a long line that the word cross the wrap width', () => {
			expect(ReflowJapanese.reflowText(' 234 6789', 'plaintext', 4, 8)).toEqual(' 234\n 6789');
		});
		it('breaks a long line that the word cross the wrap width multiple times', () => {
			expect(ReflowJapanese.reflowText(' 234 6789 12 45', 'plaintext', 4, 8)).toEqual(' 234\n 6789 12\n 45');
		});
		it('keeps a long line with a single long word', () => {
			expect(ReflowJapanese.reflowText(' 23456789', 'plaintext', 4, 8)).toEqual(' 23456789');
		});
		it('breaks a long line with multiple long words', () => {
			expect(ReflowJapanese.reflowText(' 23456789 23456789', 'plaintext', 4, 8)).toEqual(' 23456789\n 23456789');
		});
		it('keeps a short line', () => {
			expect(ReflowJapanese.reflowText(' １２３', 'plaintext', 4, 8)).toEqual(' １２３');
		});
		it('breaks a long line that the zenkaku character cross the wrap width', () => {
			expect(ReflowJapanese.reflowText(' １２３４', 'plaintext', 4, 8)).toEqual(' １２３\n ４');
		});
		it('breaks a long line that the zenkaku character cross the wrap width multiple times', () => {
			expect(ReflowJapanese.reflowText(' １２３４５６７８', 'plaintext', 4, 8)).toEqual(' １２３\n ４５６\n ７８');
		});
		it('breaks a list item', () => {
			expect(ReflowJapanese.reflowText('\t* ab cd ef', 'markdown', 4, 8)).toEqual('\t* ab\n\t  cd\n\t  ef');
		});
		it('keeps a spacial character at the end of the line', () => {
			expect(ReflowJapanese.reflowText('\t３４。６７', 'plaintext', 4, 8)).toEqual('\t３４。\n\t６７');
		});
		it('breaks a line at a second spacial character at the end of the line', () => {
			expect(ReflowJapanese.reflowText('\t３４。。６７', 'plaintext', 4, 8)).toEqual('\t３４。\n\t。６\n\t７');
		});
		it('breaks a line before a spacial character', () => {
			expect(ReflowJapanese.reflowText('\t３（５６', 'plaintext', 4, 8)).toEqual('\t３\n\t（５\n\t６');
		});
		it('breaks a line of C++ style comment', () => {
			expect(ReflowJapanese.reflowText(' // 56 89', 'cppcomment', 4, 8)).toEqual(' // 56\n // 89');
		});
		it('breaks a line of C style comment', () => {
			expect(ReflowJapanese.reflowText('  * 56 89', 'ccomment', 4, 8)).toEqual('  * 56\n  * 89');
		});
	});
});

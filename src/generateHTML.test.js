import { describe, it, expect } from '@jest/globals';
import { escapeHTML, isNullOneLevel, generateCategoryHTML, generateIndexHTML } from './generateHTML';
import { readJson, validateIndexDataItem } from './readData';

describe('generateHTML', () => {
    describe('escapeHTML', () => {
        it('creates html-safe string from input', () => {
            const result = escapeHTML('<script>alert("hi")</script>');

            expect(result).toBe('&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;');
        });
    });

    describe('isNullOneLevel', () => {
        it('returns true if there is a null value one level down', () => {
            const data = {
                "sigma": "alpha",
                "skibittti": null,
            }

            const result = isNullOneLevel(data);

            expect(result).toBe(true);
        });
        it('returns true if no input', () => {
            const result = isNullOneLevel();

            expect(result).toBe(true);
        });
    });

    describe('generateIndexHTML', () => {
        it('generates a template html from given input data', () => {
            const data = [
                {
                    title: 'title1',
                    file: 'file1.json',
                    content: {
                        "sigma": "alpha",
                        "skibittti": "beta",
                    }
                },
                {
                    title: 'title2',
                    file: 'file2.json',
                    content: {
                        "sigma": "alpha",
                        "skibittti": "beta",
                    }
                }
            ];

            const result = generateIndexHTML(data);

            expect(result).toContain('<title>Quiz Index</title>')
            expect(result).toContain("<a href=\"file2.html\">")
            expect(result).toContain("<a href=\"file1.html\">")
        });
    });
    describe('generateCategoryHTML', () => {
        it('returns a template for a category html', () => {
            const category = {
                title: 'title1',
                content: {
                    questions: [
                        {
                            question: 'question1',
                            answers: [
                                {
                                    answer: 'answer1',
                                    correct: true,
                                },
                                {
                                    answer: 'answer2',
                                    correct: false,
                                }
                            ]
                        }
                    ]
                }
            };

            const result = generateCategoryHTML(category);

            expect(result).toContain('title1 Questions');
            expect(result).toContain('question1');
            expect(result).toContain('answer1');
            expect(result).toContain('answer2');
        });
        it('returns null if no content or questions', () => {
            const category = {
                title: 'title1',
            };

            const result = generateCategoryHTML(category);

            expect(result).toBe(null);
        });
    });
});

describe('readData', () => {
    describe('readJson', () => {
        it('reads a json file and returns it as a js object', async () => {
            const result = await readJson('src/test-data/data.json');

            expect(result).toEqual({ "skibiti": "skibiti" });
        });
    });

    describe('validateIndexDataItem', () => {
        it('returns false if data is not valid', async () => {
            const data = {
                title: 'sigma',
                file: 'sigma.json',
            };

            const result = await validateIndexDataItem(data);

            expect(result).toBe(false);
        });

        it('returns false if file is not found', async () => {
            const data = {
                title: 'title1',
                file: 'file1.json',
            };

            const result = await validateIndexDataItem(data);

            expect(result).toBe(false);
        });

        it('returns true if data is valid', async () => {
            const data = {
                title: 'title1',
                file: 'index.json',
            };

            const result = await validateIndexDataItem(data);

            expect(result).toBe(true);
        });
    });
});
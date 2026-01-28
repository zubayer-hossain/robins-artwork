import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback } from 'react';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Unlink,
    Heading1,
    Heading2,
    Heading3,
    Pilcrow,
    Minus
} from 'lucide-react';

/**
 * RichTextEditor Component - A modern WYSIWYG editor using TipTap
 * 
 * @param {string} value - HTML content
 * @param {function} onChange - Callback when content changes (receives HTML string)
 * @param {string} placeholder - Placeholder text
 * @param {number} minHeight - Minimum height of editor (default: 150)
 * @param {boolean} disabled - Disable editing
 */
export default function RichTextEditor({ 
    value = '', 
    onChange, 
    placeholder = 'Write something...',
    minHeight = 150,
    disabled = false
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 hover:text-blue-800 underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    // Update editor content when value prop changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    // Update editable state
    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl || 'https://');

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return (
            <div className="animate-pulse bg-gray-100 rounded-xl" style={{ minHeight }} />
        );
    }

    const ToolbarButton = ({ onClick, isActive, disabled: btnDisabled, children, title }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={btnDisabled || disabled}
            title={title}
            className={`p-2 rounded-lg transition-all duration-200 ${
                isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } ${(btnDisabled || disabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    const ToolbarDivider = () => (
        <div className="w-px h-6 bg-gray-200 mx-1" />
    );

    return (
        <div className={`border rounded-xl overflow-hidden bg-white transition-all duration-200 ${
            editor.isFocused ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'
        } ${disabled ? 'opacity-60' : ''}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-100 bg-gray-50/50">
                {/* Text Style */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    isActive={editor.isActive('paragraph')}
                    title="Paragraph"
                >
                    <Pilcrow className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Link */}
                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    title="Add Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                {editor.isActive('link') && (
                    <ToolbarButton
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        title="Remove Link"
                    >
                        <Unlink className="w-4 h-4" />
                    </ToolbarButton>
                )}

                <div className="flex-1" />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <EditorContent 
                editor={editor} 
                className="prose prose-sm max-w-none"
                style={{ minHeight }}
            />

            {/* Styles for the editor */}
            <style>{`
                .ProseMirror {
                    padding: 1rem;
                    min-height: ${minHeight}px;
                    outline: none;
                }
                .ProseMirror p {
                    margin: 0.5em 0;
                }
                .ProseMirror h1 {
                    font-size: 1.5em;
                    font-weight: 700;
                    margin: 0.75em 0 0.5em;
                }
                .ProseMirror h2 {
                    font-size: 1.25em;
                    font-weight: 600;
                    margin: 0.75em 0 0.5em;
                }
                .ProseMirror h3 {
                    font-size: 1.1em;
                    font-weight: 600;
                    margin: 0.75em 0 0.5em;
                }
                .ProseMirror ul, .ProseMirror ol {
                    padding-left: 1.5em;
                    margin: 0.5em 0;
                }
                .ProseMirror ul {
                    list-style-type: disc;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                }
                .ProseMirror blockquote {
                    border-left: 3px solid #e5e7eb;
                    padding-left: 1em;
                    margin: 0.75em 0;
                    color: #6b7280;
                    font-style: italic;
                }
                .ProseMirror hr {
                    border: none;
                    border-top: 2px solid #e5e7eb;
                    margin: 1em 0;
                }
                .ProseMirror a {
                    color: #2563eb;
                    text-decoration: underline;
                }
                .ProseMirror a:hover {
                    color: #1d4ed8;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    );
}

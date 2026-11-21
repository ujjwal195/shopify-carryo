import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileCode2,
  FileSpreadsheet,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  PackageCheck,
  X,
} from 'lucide-react';

interface ThemeFileEntry {
  path: string;
  folder: string;
  sizeBytes: number;
  isText: boolean;
  preview: string | null;
}

interface ThemeManifest {
  themeName: string;
  version: string;
  fileCount: number;
  zipSizeBytes: number;
  files: ThemeFileEntry[];
}

interface ShopifyThemeModalProps {
  open: boolean;
  onClose: () => void;
}

const FOLDER_ORDER = ['layout', 'config', 'sections', 'snippets', 'templates', 'locales', 'assets'];

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function ShopifyThemeModal({ open, onClose }: ShopifyThemeModalProps) {
  const [manifest, setManifest] = useState<ThemeManifest | null>(null);
  const [activeTab, setActiveTab] = useState<'install' | 'files'>('install');
  const [selectedFolder, setSelectedFolder] = useState<string>('sections');
  const [selectedFilePath, setSelectedFilePath] = useState<string>('sections/carryo-hero.liquid');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || manifest) return;
    fetch('/carryo-theme-manifest.json')
      .then((res) => res.json())
      .then((data: ThemeManifest) => {
        setManifest(data);
      })
      .catch(() => {});
  }, [open, manifest]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const folderFiles = useMemo(() => {
    if (!manifest) return [];
    return manifest.files.filter((f) => f.folder === selectedFolder);
  }, [manifest, selectedFolder]);

  const activeFile = useMemo(() => {
    if (!manifest) return null;
    return (
      manifest.files.find((f) => f.path === selectedFilePath) ??
      folderFiles[0] ??
      manifest.files[0] ??
      null
    );
  }, [manifest, selectedFilePath, folderFiles]);

  if (!open) return null;

  const handleFolderSelect = (folder: string) => {
    setSelectedFolder(folder);
    const first = manifest?.files.find((f) => f.folder === folder);
    if (first) setSelectedFilePath(first.path);
  };

  const handleCopyCode = () => {
    if (!activeFile?.preview) return;
    navigator.clipboard.writeText(activeFile.preview).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Carryo Shopify Online Store 2.0 Theme Export"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-[#0D0D10] border border-[#26262C] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-6 py-5 bg-[#121216] border-b border-[#26262C] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#E0B052]">
              <PackageCheck className="w-4 h-4" aria-hidden="true" />
              <span>Shopify Online Store 2.0 Theme · Validated &amp; Upload-Ready</span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-[#F5F3EE]">
              Carryo Obsidian Shopify Theme (.zip)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Shopify theme export modal"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#F5F3EE] hover:bg-[#1C1C22] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Action Bar */}
        <div className="px-6 py-4 bg-[#141419] border-b border-[#24242A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/carryo-shopify-theme.zip"
              download="carryo-shopify-theme.zip"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#080809] bg-[#E0B052] hover:bg-[#ECC46E] rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download Theme (.zip)</span>
              {manifest && (
                <span className="font-mono text-xs opacity-80">
                  {formatBytes(manifest.zipSizeBytes)}
                </span>
              )}
            </a>

            <a
              href="/carryo-products-shopify.csv"
              download="carryo-products-shopify.csv"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#F5F3EE] bg-[#1C1C22] hover:bg-[#26262F] border border-[#2F2F38] rounded-lg transition-colors whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#E0B052]" aria-hidden="true" />
              <span>Download Products CSV</span>
            </a>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex items-center gap-1 p-1 bg-[#0A0A0D] border border-[#26262C] rounded-lg self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('install')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'install'
                  ? 'bg-[#E0B052] text-[#080809]'
                  : 'text-[#A1A1AA] hover:text-[#F5F3EE]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Install Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('files')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-[#E0B052] text-[#080809]'
                  : 'text-[#A1A1AA] hover:text-[#F5F3EE]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Inspect Files ({manifest?.fileCount ?? 57})</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'install' ? (
            <div className="space-y-8">
              {/* 3-Step Shopify Installation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#111114] border border-[#26262C] rounded-xl p-5">
                  <p className="font-mono text-xs font-semibold text-[#E0B052]">STEP 01</p>
                  <h3 className="mt-2 text-base font-bold text-[#F5F3EE]">
                    Upload ZIP to Shopify Admin
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">
                    In Shopify Admin go to <strong className="text-[#F5F3EE]">Online Store &rarr; Themes</strong>, click <strong className="text-[#F5F3EE]">Import theme &rarr; Upload zip file</strong>, select <code className="text-[#E0B052]">carryo-shopify-theme.zip</code>, and click <strong className="text-[#F5F3EE]">Publish</strong>.
                  </p>
                </div>

                <div className="bg-[#111114] border border-[#26262C] rounded-xl p-5">
                  <p className="font-mono text-xs font-semibold text-[#E0B052]">STEP 02</p>
                  <h3 className="mt-2 text-base font-bold text-[#F5F3EE]">
                    Import Carryo Products CSV
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">
                    Go to <strong className="text-[#F5F3EE]">Products &rarr; Import</strong> and upload <code className="text-[#E0B052]">carryo-products-shopify.csv</code>. It creates both <strong className="text-[#F5F3EE]">Carryo Large</strong> &amp; <strong className="text-[#F5F3EE]">Carryo Small</strong> with all 5 colours—auto-binding to the Hero, Lineup, and Ajax Bag Drawer.
                  </p>
                </div>

                <div className="bg-[#111114] border border-[#26262C] rounded-xl p-5">
                  <p className="font-mono text-xs font-semibold text-[#E0B052]">STEP 03</p>
                  <h3 className="mt-2 text-base font-bold text-[#F5F3EE]">
                    Customize in Theme Editor
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#A1A1AA]">
                    Open <strong className="text-[#F5F3EE]">Customize</strong> to edit headlines, colours, reviews, comparison rows, FAQs, or free-shipping threshold. Optionally create a page with handle <code className="text-[#E0B052]">track-order</code> using the <code className="text-[#E0B052]">track-order</code> template.
                  </p>
                </div>
              </div>

              {/* What's Included Grid */}
              <div className="bg-[#111114] border border-[#26262C] rounded-xl p-6">
                <h3 className="text-sm font-bold text-[#F5F3EE] mb-4">
                  Included in carryo-shopify-theme.zip (Online Store 2.0)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-[#E0B052]">Homepage Sections</p>
                    <p className="text-[#A1A1AA]">
                      Interactive Hero Configurator (2 Sizes, 5 Colours, 5 Angles), Lineup Cards, Commute Lookbook, How It Works Craftsmanship Tabs, Large vs. Small Comparison Table, Verified Reviews, and FAQ Accordion.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#E0B052]">Native Shopify Commerce</p>
                    <p className="text-[#A1A1AA]">
                      Slide-out Ajax Bag Drawer (<code className="text-[#F5F3EE]">/cart/add.js</code>) with free-shipping bar, Product Detail Page with colour swatches &amp; dynamic checkout button, Collections, Search, Track Order &amp; 404 templates.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#E0B052]">All 19 Carryo Photos Bundled</p>
                    <p className="text-[#A1A1AA]">
                      Your Carryo gold emblem logo plus all 18 real Black, Tan, and Grey photographs (and SVG studio previews for Light Blue &amp; Light Pink) are packed directly in <code className="text-[#F5F3EE]">assets/</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[420px]">
              {/* Folder & File Tree */}
              <div className="lg:col-span-4 bg-[#111114] border border-[#26262C] rounded-xl p-3 flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[#222228]">
                  {FOLDER_ORDER.map((folder) => {
                    const count =
                      manifest?.files.filter((f) => f.folder === folder).length ?? 0;
                    const active = selectedFolder === folder;
                    return (
                      <button
                        key={folder}
                        type="button"
                        onClick={() => handleFolderSelect(folder)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#E0B052] text-[#080809] font-semibold'
                            : 'bg-[#18181D] text-[#A1A1AA] hover:text-[#F5F3EE]'
                        }`}
                      >
                        <FolderOpen className="w-3 h-3" aria-hidden="true" />
                        <span>{folder}</span>
                        <span className="font-mono opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>

                <ul className="space-y-1 overflow-y-auto max-h-[340px]">
                  {folderFiles.map((file) => {
                    const isSelected = activeFile?.path === file.path;
                    return (
                      <li key={file.path}>
                        <button
                          type="button"
                          onClick={() => setSelectedFilePath(file.path)}
                          className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#1E1E25] text-[#E0B052] font-semibold'
                              : 'text-[#A1A1AA] hover:bg-[#17171D] hover:text-[#F5F3EE]'
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0 truncate">
                            {file.isText ? (
                              <FileCode2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            )}
                            <span className="truncate font-mono">
                              {file.path.replace(`${file.folder}/`, '')}
                            </span>
                          </span>
                          <span className="font-mono text-[10px] opacity-65 shrink-0">
                            {formatBytes(file.sizeBytes)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* File Code / Asset Viewer */}
              <div className="lg:col-span-8 bg-[#0A0A0D] border border-[#26262C] rounded-xl flex flex-col overflow-hidden">
                <div className="px-4 py-3 bg-[#131318] border-b border-[#24242A] flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[#F5F3EE] truncate">
                    {activeFile?.path ?? 'Select a file'}
                  </span>
                  {activeFile?.isText && activeFile.preview && (
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#F5F3EE] bg-[#1E1E25] hover:bg-[#282832] rounded-md transition-colors cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#34D399]" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#E0B052]" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-auto p-4 max-h-[380px]">
                  {activeFile?.isText ? (
                    <pre className="font-mono text-[11.5px] leading-relaxed text-[#D4D4D8] whitespace-pre-wrap break-words">
                      {activeFile.preview}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 text-xs text-[#A1A1AA]">
                      <ImageIcon className="w-8 h-8 text-[#E0B052] mb-3" />
                      <p className="font-semibold text-[#F5F3EE]">{activeFile?.path}</p>
                      <p className="mt-1">
                        Bundled binary image asset ({activeFile ? formatBytes(activeFile.sizeBytes) : ''}) included inside{' '}
                        <code className="text-[#E0B052]">carryo-shopify-theme.zip</code>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

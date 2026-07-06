"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslator } from "@/hooks/useTranslator";
import { TranslationBlock } from "@/components/TranslationBlock";
import { AddLanguageButton } from "@/components/AddLanguageButton";

export default function Home() {
  const {
    blocks,
    languages,
    canAdd,
    canRemove,
    handleTextChange,
    handleLangChange,
    addBlock,
    removeBlock,
  } = useTranslator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/50">
              <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4" aria-hidden="true">
                <path d="M7 3a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H7ZM4 7a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Polyglot
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            Type in any block to translate into all other languages simultaneously.
            Each block is independently editable.
          </p>
        </motion.div>
      </header>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {blocks.map((block) => (
              <TranslationBlock
                key={block.id}
                block={block}
                languages={languages}
                canRemove={canRemove}
                onTextChange={handleTextChange}
                onLangChange={handleLangChange}
                onRemove={removeBlock}
              />
            ))}

            {/* Add language button — spans full row if last */}
            {canAdd && (
              <motion.div
                key="add-button"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={
                  // If blocks count is even, add-button would start alone — span to stand out nicely
                  blocks.length % 2 === 0
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }
              >
                <AddLanguageButton onClick={addBlock} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Block count badge */}
        <motion.p
          layout
          className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600 tabular-nums"
        >
          {blocks.length} / 5 language{blocks.length !== 1 ? "s" : ""}
        </motion.p>
      </main>
    </div>
  );
}

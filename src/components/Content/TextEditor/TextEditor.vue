<script setup lang="ts">
import { computed } from 'vue';
import {
  MdEditor,
  config,
  type ToolbarNames,
  type Footers,
} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import PT_BR from '@vavt/cm-extension/dist/locale/pt-BR';

import { useDevice } from '@/composables/useDevice/index';
const { isMobile } = useDevice();

config({
  editorConfig: {
    languageUserDefined: {
      'pt-BR': PT_BR,
    },
  },
});

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const proxyText = computed<string>({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Corrigindo a tipagem dos toolbars
const toolbars = computed<ToolbarNames[]>(() =>
  isMobile.value
    ? ([
        'previewOnly',
        'italic',
        'bold',
        'underline',
        'sup',
        'title',
        'quote',
        'unorderedList',
        'orderedList',
        'code',
        'link',
        'table',
        'revoke',
        'next',
        '=',
        'markdownTotal',
      ] as ToolbarNames[])
    : ([
        'italic',
        'bold',
        'underline',
        'sup',
        'title',
        'quote',
        'unorderedList',
        'orderedList',
        'code',
        'link',
        'table',
        'revoke',
        'next',
        '=',
        'fullscreen',
        'preview',
        'markdownTotal',
      ] as ToolbarNames[])
);

// Corrigindo a tipagem dos footers
const footers = computed<Footers[]>(
  () => ['markdownTotal', '=', 'scrollSwitch'] as Footers[]
);

// Corrigindo a tipagem dos toolbars a serem excluídos
const toolbarsExclude = computed<ToolbarNames[]>(
  () =>
    [
      'strikeThrough',
      'sub',
      'task',
      'codeRow',
      'image',
      'mermaid',
      'katex',
      'save',
      'prettier',
      'pageFullscreen',
      'htmlPreview',
      'catalog',
      'github',
    ] as ToolbarNames[]
);

// Mantendo a tipagem do editorOptions correta
const editorOptions = computed<Record<string, boolean>>(() => ({
  noMermaid: true,
  noKatex: true,
  noUploadImg: true,
  noHighlight: true,
  noSuperScript: true,
  previewOnly: isMobile.value,
  preview: !isMobile.value,
}));
</script>

<template>
  <MdEditor
    id="text-editor"
    v-model="proxyText"
    :previewOnly="isMobile"
    :toolbars="toolbars"
    :footers="footers"
    :toolbarsExclude="toolbarsExclude"
    v-bind="editorOptions"
    language="pt-BR"
  />
</template>

<style>
#text-editor {
  border-radius: 8px;
}
#text-editor svg.md-editor-icon {
  width: 24px !important;
  height: 24px !important;
}

#text-editor ul {
  list-style: disc !important;
}

#text-editor ol {
  list-style: decimal !important;
}

#text-editor strong,
#text-editor b {
  font-weight: bold !important;
}

#text-editor .md-editor-toolbar,
#text-editor .md-editor-footer {
  padding: 10px !important;
  height: unset;
}

#text-editor .md-editor-footer-item span {
  font-weight: bold !important;
}
</style>

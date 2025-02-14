<script setup lang="ts">
import { computed } from 'vue';
import { MdEditor, config } from 'md-editor-v3';
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
const emit = defineEmits(['update:modelValue']);

const proxyText = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const language = 'pt-BR';
const toolbars = [
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
  'markdownTotal',
  'previewOnly',
];
const footers = ['markdownTotal', '=', 'scrollSwitch'];
const toolbarsExclude = [
  'italic',
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
];

const editorOptions = {
  noMermaid: true,
  noKatex: true,
  noUploadImg: true,
  noHighlight: true,
  noSuperScript: true,
};
</script>

<template>
  <MdEditor
    id="text-editor"
    v-model="proxyText"
    :language="language"
    :toolbars="toolbars"
    :footers="footers"
    :toolbarsExclude="toolbarsExclude"
    v-bind="editorOptions"
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

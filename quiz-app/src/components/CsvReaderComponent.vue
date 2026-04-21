<template>
  <div
    class="drop-zone"
    :class="{ 'drop-zone--over': isDragging, 'drop-zone--loaded': fileName }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="$refs.fileInput.click()"
  >
    <input
      ref="fileInput"
      type="file"
      accept=".csv"
      class="drop-zone__input"
      @change="onFileChange"
    />
    <div class="drop-zone__content">
      <svg v-if="!fileName" class="drop-zone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="8 12 12 8 16 12" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="8" x2="12" y2="20" stroke-linecap="round"/>
      </svg>
      <svg v-else class="drop-zone__icon drop-zone__icon--ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="drop-zone__label" v-if="!fileName">
        Drop a CSV file here or <span class="drop-zone__link">browse</span>
      </p>
      <p class="drop-zone__label" v-else>
        {{ fileName }}
      </p>
      <p class="drop-zone__hint" v-if="!fileName">Each row: question, answer, option1, option2…</p>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "CsvReaderComponent",
  data() {
    return {
      isDragging: false,
      fileName: null,
    };
  },
  methods: {
    onDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file) this.parseFile(file);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) this.parseFile(file);
    },
    parseFile(file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        Papa.parse(reader.result, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const questions = results.data.map((row) => {
              const options = row.slice(2).filter((o) => o.trim() !== "");
              return { question: row[0], answer: row[1], options };
            });
            this.$emit("questions-loaded", questions);
          },
        });
      };
      reader.readAsText(file);
    },
  },
};
</script>

<style>
.drop-zone {
  border: 2px dashed #4a4a4a;
  border-radius: 14px;
  padding: 36px 20px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  background-color: #252525;
  user-select: none;
}

.drop-zone:hover,
.drop-zone--over {
  border-color: #28a745;
  background-color: #1e2e1e;
}

.drop-zone--loaded {
  border-style: solid;
  border-color: #28a745;
  background-color: #1a2e1a;
}

.drop-zone__input {
  display: none;
}

.drop-zone__icon {
  width: 40px;
  height: 40px;
  color: #777;
  margin: 0 auto 12px;
  display: block;
  transition: color 0.2s ease;
}

.drop-zone:hover .drop-zone__icon,
.drop-zone--over .drop-zone__icon {
  color: #28a745;
}

.drop-zone__icon--ok {
  color: #28a745;
  width: 36px;
  height: 36px;
}

.drop-zone__label {
  font-size: 0.95rem;
  color: #ccc;
  margin: 0 0 4px;
}

.drop-zone__link {
  color: #28a745;
  text-decoration: underline;
}

.drop-zone__hint {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
}
</style>

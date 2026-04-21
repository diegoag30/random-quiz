<template>
  <div>
    <label for="formFile" class="form-label">Agregue un archivo csv</label>
    <input
      class="form-control"
      type="file"
      id="formFile"
      @change="loadQuestions"
    />
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "CsvReaderComponent",
  methods: {
    loadQuestions(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const csvContent = reader.result;
          Papa.parse(csvContent, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
              const questions = results.data.map((row) => {
                // Filter out blank options
                const options = row
                  .slice(2)
                  .filter((option) => option.trim() !== "");
                return {
                  question: row[0],
                  answer: row[1],
                  options: options,
                };
              });
              this.$emit("questions-loaded", questions);
            },
          });
        };
        reader.readAsText(file);
      }
    },
  },
};
</script>

<style>
#formFile {
  background-color: #1e1e1e;
  color: #fff; /* Text color */
  border: none;
}
</style>

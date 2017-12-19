<template>
  <div id="alpheios-morph__lexemes">
    <div class="alpheios-morph__dict" v-for="lex in lexemes">
      <span class="alpheios-morph__hdwd" :lang="lex.lemma.language">{{ lex.lemma.word }}</span>
      <span class="alpheios-morph__pronunciation" v-for="pron in lex.lemma.features.pronunciation" v-if="lex.lemma.features.pronunciation">
        [{{pron}}]
      </span>
      <div class="alpheios-morph__morph">
        <span class="alpheios-morph__pofs" v-for="pofs in lex.lemma.features['part of speech']">
          <span class="alpheios-morph__attr" v-for="kase in lex.lemma.features.case" v-if="lex.lemma.features.case">{{kase.value}}</span>
          <span class="alpheios-morph__attr" v-for="decl in lex.lemma.features.declension" v-if="lex.lemma.features.declension">{{decl.value}}</span>
          <span class="alpheios-morph__attr" v-for="kind in lex.lemma.features.kind" v-if="lex.lemma.features.kind">{{kind.value}}</span>
          {{ pofs.value }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Morph',
    props: ['lexemes'],
    mounted () {
      console.log('Morph is mounted')
        // for each infl without dial
        //   sort by stem, pref, suff, pofs/@order
        //   group by stem and pofs
        // for each infl without dial and without either stem or pofs
        // for each infl with dial
        // inflection-set:
        //  ignores conjunction, preposition, interjection, particle
        //  take pofs and decl from infl if it differs from dict
        //  add dialect
    },
  }
</script>
<style>

  .alpheios-morph__dict {
    margin-bottom: .5em;
    clear: both;
  }

  .alpheios-morph__source {
    font-size: small;
    color: #4E6476; /** TODO use alpheios variable **/
    font-style: italic;
  }

  .alpheios-morph__dial {
      font-size: smaller;
  }

  .alpheios-morph__attr {
      font-weight: normal;
      color: #0E2233; /** TODO use alpheios variable **/
  }

  .alpheios-morph__linked-attr {
  	color:#3E8D9C; /** TODO use alpheios variable **/
  	font-weight: bold;
  	cursor: pointer;
  }

  .alpheios-morph__linked-attr:hover {
      color: #5BC8DC !important;
  }

  .alpheios-morph__pofs:after {
      content: ";";
  }

</style>

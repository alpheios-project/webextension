<template>
  <div id="alpheios-morph__lexemes">
    <div class="alpheios-morph__dict" v-for="lex in lexemes">
      <span class="alpheios-morph__lemma" v-if="! lex.lemma.principalParts.includes(lex.lemma.word)" :lang="lex.lemma.language">{{ lex.lemma.word }}</span>
      <span class="alpheios-morph__pparts">
        <span class="alpheios-morph__listitem" v-for="part in lex.lemma.principalParts" :lang="lex.lemma.language">{{ part }}</span>
      </span>
      <span class="alpheios-morph__pronunciation" v-for="pron in lex.lemma.features.pronunciation" v-if="lex.lemma.features.pronunciation">
        [{{pron}}]
      </span>
      <div class="alpheios-morph__morph">
        <span class="alpheios-morph__pofs" v-for="pofs in lex.lemma.features['part of speech']">
          <span class="alpheios-morph__attr" v-for="kase in lex.lemma.features['case']" v-if="lex.lemma.features['case']">{{kase.value}}</span>
          <span class="alpheios-morph__attr" v-for="gender in lex.lemma.features.gender" v-if="lex.lemma.features.gender">{{gender.value}}</span>
          {{ pofs.value }}
        </span>
        <span class="alpheios-morph__attr" v-for="kind in lex.lemma.features.kind" v-if="lex.lemma.features.kind">{{kind.value}}</span>
        <span class="alpheios-morph__attr" v-for="decl in lex.lemma.features.declension" v-if="lex.lemma.features.declension">{{decl.value}} declension</span>
        <span class="alpheios-morph__attr" v-for="conj in lex.lemma.features.conjugation" v-if="lex.lemma.features.conjugation">{{conj.value}}</span>
        <span class="alpheios-morph__parenthesized" v-if="lex.lemma.features.age || lex.lemma.features.area || lex.lemma.features.geo || lex.lemma.features.frequency">
          <span class="alpheios-morph__attr alpheios-morph__listitem" v-for="age in lex.lemma.features.age" v-if="lex.lemma.features.age">( {{age.value}} )</span>
          <span class="alpheios-morph__attr alpheios-morph__listitem" v-for="area in lex.lemma.features.area" v-if="lex.lemma.features.area">{{area.value}} </span>
          <span class="alpheios-morph__attr alpheios-morph__listitem" v-for="geo in lex.lemma.features.geo" v-if="lex.lemma.features.geo">{{geo.value}}</span>
          <span class="alpheios-morph__attr alpheios-morph__listitem" v-for="freq in lex.lemma.features.frequency" v-if="lex.lemma.features.frequency">{{freq.value}}</span>
        </span>
        <span class="alpheios-morph__attr" v-for="source in lex.lemma.features.source" v-if="lex.lemma.features.source">[{{source.value}}]</span>
        <span class="alpheios-morph__attr" v-for="note in lex.lemma.features.note" v-if="lex.lemma.features.note">[{{source.note}}]</span>
      </div>
      <div class="alpheios-morph__inflections">
        <div class="alpheios-morph__inflset" v-for="inflset in lex.getGroupedInflections()">
          <div class="alpheios-morph__list">
            <div class="alpheios-morph__infl" v-for="group in inflset[1]">
              <div class="alpheios-morph__showiffirst">
                <span class="alpheios-morph__prefix" v-if="group[1][0][1][0].prefix">{{group[1][0][1][0].prefix}} </span>
                <span class="alpheios-morph__stem">{{group[1][0][1][0].stem}}</span>
                <span class="alpheios-morph__suffix" v-if="group[1][0][1][0].suffix"> -{{group[1][0][1][0].suffix}}</span>
                <span class="alpheios-morph__pofs"
                  v-for="pofs in group[1][0][1][0]['part of speech']"
                  v-if="! group[1][0][1][0].featureMatch('part of speech',lex.lemma.features)">{{pofs.value}}</span>
                <span class="alpheios-morph__declension"
                  v-for="decl in group[1][0][1][0]['declension']"
                  v-if="! group[1][0][1][0].featureMatch('declension',lex.lemma.features)">{{decl.value}}</span>
              </div>
              <span>{{group[0]}}
                <span class="alpheios-morph__items alpheios-morph__listitem" v-for="infl in group[1]">
                    <span class="alpheios-morph__group">
                      {{ infl[0] }}
                      <span class="alpheios-morph__groupitem" v-for="item in infl[1]">
                        <span class="alpheios-morph__case" v-for="kase in item.case">
                          {{ kase.value }}
                          <span class="alpheios-morph__gender alpheios-morph__parenthesized" v-for="gend in item.gender">
                            {{ gend.value }}
                          </span>
                        </span>
                      </span>
                    </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="alpheios-morph__provider">
        {{ lex.provider.toString() }}
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Morph',
    props: ['lexemes','inflectionGrouper'],
    mounted () {
      console.log('Morph is mounted')
        // for each infl without dial
        //   group by stem, pref, suff, pofs, comp
        //   sort by pofs
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

  .alpheios-morph__lemma, .alpheios-morph__pparts, .alpheios-morph__stem, .alpheios-morph__prefix, .alpheios-morph__suffix {
    font-weight: bold;
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

  .alpheios-morph__provider {
    font-size: small;
    font-weight: normal;
    color: #4E6476; /** TODO use alpheios variable **/
    font-style: italic;
    padding-left: .5em;
  }

  .alpheios-morph__listitem:after {
      content: ", ";
   }

  .alpheios-morph__listitem:last-child:after {
      content: "";
   }

  .alpheios-morph__parenthesized:before {
      content: "(";
   }

  .alpheios-morph__parenthesized:after {
      content: ")";
   }

   .alpheios-morph__list .alpheios-morph__infl:first-child .alpheios-morph__showiffirst {
     display: block;
   }

   .alpheios-morph__list .alpheios-morph__infl .alpheios-morph__showiffirst {
     display: none;
   }

   .alpheios-popup__content .alpheios-shortdef__lemma {
     display: none;
   }

   .alpheios-popup__content .alpheios-fulldef__lemma {
     display: none;
   }

</style>

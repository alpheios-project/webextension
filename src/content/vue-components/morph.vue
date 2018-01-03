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
        <span class="alpheios-morph__pofs">
          <span class="alpheios-morph__attr" v-for="kase in lex.lemma.features['case']" v-if="lex.lemma.features['case']">{{kase.value}}</span>
          <span class="alpheios-morph__attr" v-for="gender in lex.lemma.features.gender" v-if="lex.lemma.features.gender">{{gender.value}}</span>
          {{ lex.lemma.features['part of speech'].toString() }}
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
      <div v-for="definition in definitions[lex.lemma.key]">
        <shortdef :definition="definition"></shortdef>
      </div>
      <div class="alpheios-morph__inflections">
        <div class="alpheios-morph__inflset" v-for="inflset in lex.getGroupedInflections()">
          <div class="alpheios-morph__heading">Form(s):</div>
          <span class="alpheios-morph__prefix" v-if="inflset.groupingKey.prefix">{{inflset.groupingKey.prefix}} </span>
          <span class="alpheios-morph__stem">{{inflset.groupingKey.stem}}</span>
          <span class="alpheios-morph__suffix" v-if="inflset.groupingKey.suffix"> -{{inflset.groupingKey.suffix}}</span>
          <span class="alpheios-morph__pofs alpheios-morph__parenthesized"
            v-if="! featureMatch(lex.lemma.features['part of speech'],inflset.groupingKey['part of speech'])">{{inflset.groupingKey["part of speech"].toString()}}</span>
          <span class="alpheios-morph__declension alpheios-morph__parenthesized"
            v-if="inflset.groupingKey.declension && inflset.groupingKey.declension !== lex.lemma.features.declension">{{inflset.groupingKey.declension.toString()}}</span>

          <div class="alpheios-morph__inflgroup" v-for="group in inflset.inflections">
            <span class="alpheios-morph__number" v-if="group.groupingKey.number && group.groupingKey.isCaseInflectionSet">{{ group.groupingKey.number.toString() }}</span>
            <span class="alpheios-morph__tense" v-if="group.groupingKey.tense && group.groupingKey.isCaseInflectionSet">{{ group.groupingKey.tense.toString() }}</span>
            <span v-for="nextGroup in group.inflections">
              <span v-if="group.groupingKey.isCaseInflectionSet">
                <span class="alpheios-morph__voice" v-if="group.groupingKey.isCaseInflectionSet && nextGroup.groupingKey.voice">{{ nextGroup.groupingKey.voice.toString() }}</span>
                <span class="alpheios-morph__tense" v-if="group.groupingKey.isCaseInflectionSet && nextGroup.groupingKey.tense">{{ nextGroup.groupingKey.tense.toString() }}</span>
                :
              </span>
              <span>
                <span v-for="infl in nextGroup.inflections">

                  <span class="alpheios-morph__case" v-if="infl.groupingKey.case">
                    {{ infl.groupingKey.case.toString() }}
                    <span class="alpheios-morph__gender alpheios-morph__parenthesized"
                      v-if="infl.groupingKey.gender && ! featureMatch(infl.groupingKey.gender,lex.lemma.features.gender) ">
                      {{ infl.groupingKey.gender.map((g) => g.toLocaleStringAbbr()).toString()}}
                    </span>

                    <span class="alpheios-morph__comparison" v-if="infl.groupingKey.comparison">
                      {{ infl.groupingKey.comparison.toString() }}
                    </span>

                  </span>

                  <span class="alpheios-morph__person" v-if="infl.groupingKey.person">
                    {{ infl.groupingKey.person.toString() }} person
                  </span>

                  <span class="alpheios-morph__number" v-if="infl.groupingKey.number && ! group.groupingKey.isCaseInflectionSet">
                    {{ infl.groupingKey.number.toString() }}
                  </span>

                  <span class="alpheios-morph__tense" v-if="infl.groupingKey.tense && ! group.groupingKey.isCaseInflectionSet && ! nextGroup.groupingKey.tense">
                    {{ infl.groupingKey.tense.toString() }}
                  </span>

                  <span class="alpheios-morph__mood" v-if="infl.groupingKey.mood && !group.groupingKey.isCaseInflectionSet">
                    {{ infl.groupingKey.mood.toString() }}
                  </span>

                  <span class="alpheios-morph__voice" v-if="infl.groupingKey.voice && !group.groupingKey.isCaseInflectionSet">
                    {{ infl.groupingKey.voice.toString() }}
                  </span>

                  <span v-for="item in infl.inflections">
                    <span class="alpheios-morph__example" v-if="item.example">{{ item.example.toString() }}</span>
                  </span>

                </span><!-- end span infl -->
              </span>
            </span><!-- end span groupinflections -->
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
  import ShortDef from './shortdef.vue'

  export default {
    name: 'Morph',
    components: { shortdef: ShortDef },
    props: ['lexemes','definitions'],
    methods: {
      featureMatch(a,b) {
        let matches = false
        for (let f of a) {
          if (b && b.filter((x) => x.isEqual(f)).length > 0) {
            matches = true
            break
          }
        }
        return matches
      }
    },
    mounted () {
      console.log('Morph is mounted')
    },
  }
</script>
<style>

  #alpheios-morph__lexemes {
      color: #0E2233; /** TODO use alpheios variable **/
  }
  .alpheios-morph__dict {
    margin-bottom: .5em;
    clear: both;
  }

  .alpheios-morph__lemma, .alpheios-morph__pparts, .alpheios-morph__stem, .alpheios-morph__prefix, .alpheios-morph__suffix {
    font-weight: bold;
  }

  .alpheios-morph__source {
    font-size: smaller;
    color: #4E6476; /** TODO use alpheios variable **/
    font-style: italic;
  }

  .alpheios-morph__dial {
      font-size: smaller;
  }

  .alpheios-morph__attr {
      font-weight: normal;
  }

  .alpheios-morph__linked-attr {
  	font-weight: bold;
  	cursor: pointer;
  }

  .alpheios-morph__linked-attr:hover {
      color: #5BC8DC !important;
  }

  .alpheios-morph__pofs:after {
      content: ";";
  }

  .alpheios-morph__inflset .alpheios-morph__heading {
      display: none;
  }

  .alpheios-morph__inflset:first-child .alpheios-morph__heading {
      color: #4E6476; /** TODO use alpheios variable **/
      display: block;
  }

  .alpheios-morph__provider {
    font-size: smaller;
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

   #alpheios-morph__lexemes .alpheios-definition__lemma {
       display: none;
   }

</style>

<template>
    <modal name="popup"
           transition="nice-modal-fade"
           classes="popup"
           :min-width="200"
           :min-height="200"
           :pivot-y="0.5"
           :adaptive="true"
           :resizable="true"
           :draggable="true"
           :scrollable="true"
           :reset="true"
           width="60%"
           height="auto"
           @before-open="beforeOpen"
           @opened="opened"
           @closed="closed"
           @before-close="beforeClose">
        <div class="popup-content">
            <h2>Title</h2>
            <div>A new paragraph will be added every 5 sec to show how <b>height</b> scales.</div>
            <div v-for="(p, i) in paragraphs" :key="i">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum purus egestas libero ornare venenatis.
                Maecenas pharetra tortor eu tortor imperdiet, a faucibus quam finibus. Nulla id lacinia quam.
                Praesent imperdiet sed magna non finibus. Aenean blandit, mauris vitae lacinia rutrum,
                nunc mi scelerisque sem, in laoreet sem lectus ut orci. Ut egestas nulla in vehicula feugiat.
                Vivamus tincidunt nisi vel risus dictum suscipit. Nulla id blandit mi, vulputate aliquam enim.
            </div>
            <a href="http://test.com">Test Link</a>
        </div>
    </modal>
</template>
<script>
  export default {
    name: 'Popup',
    data () {
      return {
        paragraphs: [true],
        timer: null
      }
    },
    methods: {
      beforeOpen () {
        this.timer = setInterval(() => {
          this.paragraphs.push(true)
        }, 5000)
      },

      beforeClose () {
        clearInterval(this.timer)
        this.timer = null
        this.paragraphs = []
      },

      opened (e) {
        // e.ref should not be undefined here
        console.log('opened', e)
        console.log('ref', e.ref)
      },

      closed (e) {
        console.log('closed', e)
      }
    }
  }
</script>
<style>
    .popup {
        border-radius: 5px;
        background: #F7F7F7;
        box-shadow: 5px 5px 30px 0 rgba(46, 61, 73, 0.6);
    }

    .popup-content {
        padding: 20px;
        font-size: 14px;
    }

    .v--modal-overlay[data-modal="popup"] {
        background: rgba(0, 0, 0, 0.5);
    }
</style>

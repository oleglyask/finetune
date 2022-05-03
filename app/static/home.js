
document.getElementById('basic').checked = true

play = document.getElementById('play')
play.addEventListener('click', () => {
        document.querySelectorAll('.radio-btn').forEach(radio => {
            if (radio.checked === true) {
                play.href = "{{url_for('main.play', level='')}}" + radio.value
            }
        })
    })
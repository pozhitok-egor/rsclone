export default function loading (block, type = true) {
    if (type) {
        if (document.querySelector('body').contains(document.querySelector('.loading')) === false) {
            const blockLoad = document.createElement('div');
            blockLoad.classList.add('loading');
            const loadBlock = document.createElement('div');
            loadBlock.classList.add('windows8');
            for (let x = 1; x < 6; x += 1) {
                const ball = document.createElement('div');
                ball.classList.add('wBall');
                ball.id = `wBall_${x}`;
                const ballFill = document.createElement('div');
                ballFill.classList.add('wInnerBall');
                ball.append(ballFill);
                loadBlock.append(ball);
            }
            blockLoad.append(loadBlock);
            block.append(blockLoad);
        }
    } else if (document.querySelector('body').contains(document.querySelector('.loading'))) {
        document.querySelector('.loading').remove();
    }
}
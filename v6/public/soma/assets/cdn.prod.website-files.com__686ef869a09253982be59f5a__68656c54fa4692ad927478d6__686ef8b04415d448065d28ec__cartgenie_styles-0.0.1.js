const style = document.createElement('style');
        style.textContent = `
            [data-cg-hidden='1'] {
                display: none;
            }
        `;
        document.head.appendChild(style);
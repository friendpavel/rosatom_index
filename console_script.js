(async function () {
    const INNS = ['3662287865', '7706413348'];

    for (const inn of INNS) {
        console.log('\n========== ' + inn + ' ==========');
        try {
            const resp = await fetch('/call/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    Class: 'FogSoft.RosatomRating.WebService.Services.PublicSupplierService',
                    Method: 'GetSuppliers',
                    Args: [{ SupplierDetails: inn }]
                })
            });
            const json = await resp.json();
            if (!json.Suppliers || !json.Suppliers.length) {
                console.warn('Поставщик с ИНН ' + inn + ' не найден');
                continue;
            }

            const id = json.Suppliers[0].Id;
            const pageResp = await fetch('/supplier/' + id + '/', { credentials: 'include' });
            const html = await pageResp.text();

            const d = new DOMParser().parseFromString(html, 'text/html');
            const vals = d.querySelectorAll('.top-info-block-main .control-block .value-view');

            console.log('Наименование:' + (d.querySelector('h1.container')?.textContent.trim()));
            console.log('ИНН:' + (vals[0]?.textContent.trim()));
            console.log('КПП:' + (vals[1]?.textContent.trim()));
            console.log('ОГРН:' + (vals[2]?.textContent.trim()));
            console.log('Дата расчёта индекса:' + (d.querySelector('#index-calculation-date')?.textContent.trim()));
            console.log('Запрашиваемая дата:' + (d.querySelector('#requested-index-calculation-date')?.textContent.trim()));
            console.log('Индекс деловой репутации (*10³):');
            console.log(d.querySelector('#supplier-index')?.textContent.trim());
        } catch (e) {
            console.error('Ошибка при обработке ИНН ' + inn + ':', e);
        }
    }
})();

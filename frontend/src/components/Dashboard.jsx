import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { http } from '../http';
import { useEffect, useState } from 'react';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import useSocket from '../customHooks/useSocket';
import { Badge } from 'primereact/badge';
import { VirtualScroller } from 'primereact/virtualscroller';
import { classNames } from 'primereact/utils';

const Dashboard = () => {
  const { messages } = useSocket('ws://localhost:8111?userId=' + localStorage.getItem('id'));
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [coins, setCoins] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [totalCoins, setTotalCoins] = useState();
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [openNotification, setOpenNotification] = useState(false);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const fetchCoins = async () => {
    try {
      const data = await http(`/coins?noOfRows=${rows}&pageNum=${first}`)
        .then(data => data.json());
      setCoins(data.message);
      setTotalCoins(data.numberOfCoins)
      console.log(data)

    } catch (_) { }
    finally {
      // setLoadingCoins(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await http('/me')
        if (!res.ok) throw new Error;
        setUserId(res.data.id)

      } catch (_) {

      }
    })()

  }, [])
  const watchlistButtonTemplate = (coin) => {
    const bgColor = coin.watchLists.length > 0 ? 'bg-green-500' : 'bg-blue-500'

    // console.log(parseFloat(coin.watchLists[0].max < parseFloat(coin.price)))

    const outOfRange = coin.watchLists.length > 0 &&
      (parseFloat(coin.watchLists[0].min) > parseFloat(coin.price) ||
        parseFloat(coin.watchLists[0].max) < parseFloat(coin.price))
      ? 'bg-red-500'
      : bgColor;

    return (
      <Button
        icon="pi pi-eye"
        className={`bg-blue-500 text-white py-1 px-1 ${outOfRange} w-[95px] text-center`}
        onClick={() => handleAddWatchlist(coin)}
      >
        {coin.watchLists.length > 0 ? <span className={`watching-text ml-1`}>Watching</span>
          : <span className='ml-2 text-center block'>Watch</span>}
      </Button>
    );
  };

  const handleAddWatchlist = (coin) => {
    setSelectedCoin(coin);
    setDisplayDialog(true);

    if (parseFloat(coin.watchLists[0].max)) {
      setIsUpdate(true);
      setMaxPrice(parseFloat(coin.watchLists[0].max))
      setMinPrice(parseFloat(coin.watchLists[0].min))
    }
  };

  const hideDialog = () => {
    setDisplayDialog(false);
    setMinPrice(null);
    setMaxPrice(null);
    setSelectedCoin(null);
  };

  const saveWatchlist = async (coin) => {
    if (selectedCoin) {
      console.log(selectedCoin.id, 'hdhd')
      try {
        const response = await http(`/watchlist/${isUpdate && coin.watchLists[0].id}`, {
          body: {
            coinId: selectedCoin.id,
            minPrice,
            maxPrice
          },
          method: isUpdate ? 'put' : 'post'
        }
        );

        if (!response.ok) throw new Error;
      } catch (error) {
        console.error('Error saving to watchlist:', error);

      } finally {
        hideDialog();
      }
    }
  };

  useEffect(() => {
    fetchCoins();

  }, [rows, first, messages]);

  const imageBodyTemplate = (coins) => {
    return <img src={`${coins.imageUrl}`} alt="Error" className="w-6rem shadow-2 border-round h-[50px] w-[50px]" />;
  };

  const itemTemplate = (item, options) => {
    const className = classNames('flex align-items-center p-2', {
      'surface-hover': options.odd
    });
    return (
      <div className={className} style={{ height: options.props.itemSize + 'px' }}>
        {item}
      </div>
    );
  }

  return (
    <div className='p-10'>

      <Badge value={messages.length} severity="info" className="cursor-pointer mb-2" onClick={() => setOpenNotification(!openNotification)} />
      {openNotification && <div className="card flex justify-content-center">
        <VirtualScroller items={messages} itemSize={50} itemTemplate={itemTemplate} className="border-1 mb-4 bg-gray-100  surface-border border-round text-green-900" style={{ width: '200px', minHeight: '100px', height: 'auto', maxHeight: '200px' }} />
      </div>}

      <DataTable value={coins} showGridlines tableStyle={{ minWidth: '50rem' }}>
        <Column field="id" header="Id" hidden></Column>
        <Column header="Action" body={watchlistButtonTemplate} />
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="imageUrl" header="Image" body={imageBodyTemplate}></Column>
        <Column field="price" header="Price"></Column>
        <Column field="marketCap" header="Market Cap"></Column>
        <Column field="change24h" header="24h"></Column>
      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalCoins}
        rowsPerPageOptions={[10, 20, 30, 50, 100]}
        onPageChange={onPageChange} />

      <Dialog header="Add to Watchlist" visible={displayDialog} style={{ width: '35vw', backgroundColor: 'red' }} onHide={hideDialog}>
        <div className="flex gap-3">
          <div className="p-field flex flex-col gap-2">
            <label htmlFor="minPrice">Min Price</label>
            <InputNumber id="minPrice" value={minPrice} onValueChange={(e) => setMinPrice(e.value)} mode="currency" currency="USD" locale="en-US" className='bg-gray-100' />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="maxPrice">Max Price</label>
            <InputNumber id="maxPrice" value={maxPrice} onValueChange={(e) => setMaxPrice(e.value)} mode="currency" currency="USD" locale="en-US" />
          </div>
        </div>

        <div className=" gap-4 flex justify-end items-center h-10">
          <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />
          <Button label="Save" icon="pi pi-check" onClick={() => saveWatchlist(selectedCoin)} autoFocus />
        </div>
      </Dialog>

    </div>
  )
}


export default Dashboard
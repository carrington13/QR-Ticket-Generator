//add a concert to the user account
async function newTicketHandler(event) {
  event.preventDefault();
    
  //get new ticket for concert
  const user_id = document.querySelector('input[name="singleConcertUser"]').value;

  const concert_id = document.querySelector('input[name="singleConcertID"]').value;

  const concert = document.querySelector('input[name="concertName"]').value;

  const stock = JSON.parse(document.querySelector('#stock').textContent) - 1; 
  // if stock is greater than or equal to 0
  if (stock >= 0) {
    // Send fetch request to update stock
    const responseConcertStock = await fetch(`/api/concert/${concert_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          stock: stock
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    // if that response was good
    if (responseConcertStock.ok) {
      // Send post request to create new ticket
      const responseAddTicket = await fetch(`/account/add`, {
        method: 'POST',
        body: JSON.stringify({
          user_id,
          concert_id,
          concert
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });


      //if ok go to dashboard where you should see the new post
      if (responseAddTicket.ok) {
        document.location.replace('/account');
      } else {
        alert(responseAddTicket.statusText);
      }
    } else {
      alert(responseConcertStock.statusText);
    }
  } else {
    alert("Out of Stock!");
  }
}

//create new post listener
document.querySelector('#single_concert').addEventListener('click', newTicketHandler);
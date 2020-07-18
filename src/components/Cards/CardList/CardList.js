import React, { Component } from "react";
import axios from "../../../axios-cards";
import "./CardList.css";
import GiftCard from "../Card/Card";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Shop from "../../../containers/Shop/Shop";
import Modal from "../../UI/Modal/Modal";
import { Card, Button } from "@material-ui/core";

class CardList extends Component {
  state = {
    giftCards: [],
    loading: false,
    showModal: false,
    giftCardId: null,
    modalStatus: 0,
    confirmedData: {},
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get("/giftCards")
      .then((response) => {
        this.setState({ loading: false });
        this.setState({ giftCards: response.data.Body });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  buyClickedHandler = (id) => {
    this.setState({ showModal: true, giftCardId: id, modalStatus: 1 });
  };

  modalClosedHandler = () => {
    this.setState({ showModal: false, modalStatus: 0 });
  };

  clickedPayment = (txnId) => {
    // event.preventDefault();
    console.log(txnId);
    const reqBody = {
      txnId: txnId,
    };
    axios.post("/confirmPurchase", reqBody).then((response) => {
      console.log(response);
      this.setState({
        confirmedData: response.data,
        showComfirm: true,
        modalStatus: 1,
      });
    });
  };

  render() {
    let cards = this.state.giftCards.map((card) => {
      return (
        <GiftCard
          key={card._id}
          id={card._id}
          type={card.type}
          image={card.image}
          price={card.price}
          clicked={this.buyClickedHandler}
        />
      );
    });
    let confirmedData = (
      <Card>
        <div>
          <div style={{ textAlign: "center" }}>
            Thanks for buying Google Playstore USA from eGift Shop
          </div>
          <div style={{ textAlign: "center" }}>
            <p>Your pin code is here</p>
            <Button style={{ background: "#ccc" }}>
              {this.state.confirmedData.pinCode}
            </Button>
          </div>
          <div
            className="PaymentBtn"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            COPY PIN CODE
          </div>
        </div>
      </Card>
    );
    let cardList = this.state.loading ? (
      <Spinner />
    ) : (
      <div className="CardList">
        <Modal
          show={this.state.showModal}
          modalClosed={this.modalClosedHandler}
        >
          {this.modalStatus === 0 ? (
            this.state.giftCardId ? (
              <Shop id={this.state.giftCardId} clicked={this.clickedPayment} />
            ) : null
          ) : (
            confirmedData
          )}
        </Modal>
        {cards}
      </div>
    );
    return cardList;
  }
}

export default CardList;

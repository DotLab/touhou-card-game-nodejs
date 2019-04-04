import React from 'react';

const LIFE_UPGRADE_AMOUNT = 100;
const LIFE_UPGRADE_COST = 50;

export default class Store extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.toggleView = this.toggleView.bind(this);
    this.buyLife = this.buyLife.bind(this);

    this.state = {
      showStore: false,
      playersList: [],
    };
  }

  toggleView() {
    this.setState({showStore: !this.state.showStore});
  }

  async buyLife() {
    if (this.app.state.user.spiritPointsCount >= LIFE_UPGRADE_COST) {
      const res = await this.app.genericApi0('cl_store_buy_life');
      this.app.setState({user: {
        ...this.app.state.user,
        spiritPointsCount: res.spiritPointsCount, 
        lifeUpgrade: res.lifeUpgrade,
      }});
    } else {
      this.app.setState({message: 'Not enough Spirit Points'});
    }
  }

  render() {
    const s = this.state;
    const user = this.app.state.user;
    const isLoggedIn = user !== null;

    return <div className="container mt-2">
      {isLoggedIn && <button className="btn btn-info" onClick={this.toggleView}>Store</button>}
      {s.showStore && <div className="mt-2">
        <table className="table table-striped my-0 py-0">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Item Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="Va(m)!">Life +{LIFE_UPGRADE_AMOUNT} L</td>
              <td className="Va(m)!">{LIFE_UPGRADE_COST} SP</td>
              <td className="Va(m)!">{user.spiritPointsCount >= LIFE_UPGRADE_COST ? <button className="btn btn-danger" onClick={this.buyLife}>Buy</button> : "Too Poor To Buy"}</td>
            </tr>
            {/* <tr>
              <td>Card Upgrade </td>
              <td>-100 Spirit Points </td>
              <td>Not yet implemented </td>
            </tr> */}
          </tbody>
        </table>

      </div>}
    </div>;
  }
}

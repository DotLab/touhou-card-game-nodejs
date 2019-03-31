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
      const points = await this.app.genericApi0('cl_store_buy_life');
      this.app.setState({user: {
        ...this.app.state.user,
        spiritPointsCount: points.spiritPointsCount, 
        lifeUpgrade: points.lifeUpgrade,
      }});
    } else {
      this.setState({message: 'Not enough Spirit Points'});
    }
  }

  render() {
    const s = this.state;
    const user = this.app.state.user;
    const isLoggedIn = user !== null;
    return <div>
      {isLoggedIn && <button onClick={this.toggleView}>Store</button>}
      {s.showStore && <div>
        <table>
          <tbody>
            <tr>
              <th align='left'>Item </th>
              <th align='left'>Cost </th>
              <th> </th>
            </tr>
            <tr>
              <td>Life +{LIFE_UPGRADE_AMOUNT} </td>
              <td>-{LIFE_UPGRADE_COST} Spirit Points </td>
              <td><button onClick={this.buyLife}>Buy</button> </td>
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

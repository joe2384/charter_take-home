import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  getData,
  filterByValue,
  filterByState,
  filterByGenre,
  filterByAttire,
} from '../store/actions/action';
import Table from '../components/table';
import DropDown from '../components/dropDown';
import Pagination from '../components/pagination';
import '../styles/App.css';

interface TableContainerState {
  value: string;
  pageNumber: number;
}

const mapStateToProps = (state: ReduxState) => {
  const {
    data,
    filteredData,
    error,
    search,
    stateSelectedTest,
    genre,
    attire,
  } = state.dataReducers;
  return {
    data,
    filteredData,
    error,
    search,
    stateSelectedTest,
    genre,
    attire,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getData: getData,
      filterByValue: filterByValue,
      filterByState: filterByState,
      filterByGenre: filterByGenre,
      filterByAttire: filterByAttire,
    },
    dispatch
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class TableContainer extends React.Component<
  Props,
  TableContainerState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
      pageNumber: 0,
    };
  }

  componentDidMount() {
    this.props.getData(`/api/restaurants`);
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.filterByValue(this.state.value);
    this.setState({
      pageNumber: 0,
    });
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleStateSelected = (e: React.ChangeEvent<HTMLSelectElement> | any) => {
    this.props.filterByState(e);
  };

  handleGenreSelected = (e: React.ChangeEvent<HTMLSelectElement> | any) => {
    this.props.filterByGenre(e);
  };

  handleAttireSelected = (e: React.ChangeEvent<HTMLSelectElement> | any) => {
    this.props.filterByAttire(e);
  };

  paginationHandler = (pageNumber: any) => {
    this.setState({
      pageNumber: pageNumber.selected,
    });
  };

  render() {
    const Style: any = {
      form: {
        backgroundColor: '#333EEB',
        width: ' 100%',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      },
      input: {
        width: '200px',
        margin: '0 12px',
      },
    };
    const {
      data,
      filteredData,
      error,
      search,
      stateSelectedTest,
      genre,
      attire,
    } = this.props;
    const { value, pageNumber } = this.state;
    const filterStates = data.map((location) => location.state);
    const filterGenre = data.map((food) => food.genre.split(',')).flat();
    const filterAttire = data.map((attire) => attire.attire);
    return (
      <Fragment>
        <form style={Style.form} onSubmit={(e) => this.handleSubmit(e)}>
          <DropDown
            search={search}
            value={stateSelectedTest}
            data={filterStates}
            filterType={'State'}
            handleSelected={this.handleStateSelected}
          />

          <DropDown
            search={search}
            value={genre}
            data={filterGenre}
            filterType={'Genre'}
            handleSelected={this.handleGenreSelected}
          />

          <DropDown
            search={search}
            value={attire}
            data={filterAttire}
            filterType={'Attire'}
            handleSelected={this.handleAttireSelected}
          />
          <input
            style={Style.input}
            type="text"
            value={value}
            onChange={(e) => this.handleChange(e)}
            placeholder="Search Name, City, or Genre"
          />

          <button type="submit" value="Submit">
            Search
          </button>
        </form>
        {filteredData[0] || (filteredData[pageNumber] && !error) ? (
          <Table
            rows={['Name', 'City', 'State', 'Phone number', 'Genres', 'Attire']}
            columns={['name', 'city', 'state', 'telephone', 'genre', 'attire']}
            filteredData={
              filteredData[pageNumber] === undefined
                ? filteredData[0]
                : filteredData[pageNumber]
            }
          />
        ) : (
          <div>No restaurants</div>
        )}
        <Pagination
          paginationHandler={this.paginationHandler}
          pageCount={filteredData.length}
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableContainer);

import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import {
  getBeerList,
  setBeerTableColumns,
  changeBeerTableColumn,
} from "../Modules/Reducers/beers";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import styled from "styled-components";
import BeerDetailInfo from "../Components/BeerDetailInfo";
import { Spin, Select } from "antd";

const BeerListTableWrapper = styled.div`
  margin: 5% 20% 5% 20%;
`;

const Loading = styled(Spin)`
  width: 100%;
  margin-top: 250px;
`;

const BeerList = () => {
  const dispatch = useDispatch();
  const beerList = useSelector((state) => state.beers.beerList);
  const beerTableColumns = useSelector((state) => state.beers.beerTableColumns);
  const isLoading = useSelector((state) => state.beers.isLoading);

  const data = beerList.map((info) => {
    return {
      name: info.name,
      abv: info.abv,
      summary: info.tagline,
      img: info.image_url,
    };
  });

  const columns = [
    {
      id: 1,
      title: "BEER",
      field: "name",
      render: (row) => (
        <a href="#!" onClick={showModal}>
          {row.name}
        </a>
      ),
    },
    {
      id: 2,
      title: "ABV",
      field: "abv",
    },
    {
      id: 3,
      title: "SUMMARY",
      field: "summary",
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTarget, setModalTarget] = useState("");
  const [selectedAdv, setSelectedAdv] = useState("All");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getBeerList());
  }, [dispatch]);

  useEffect(() => {
    const [start, end] = selectedAdv.split("~");

    setFilteredData(
      selectedAdv === "All"
        ? data
        : data.filter((v) => start <= v.abv && v.abv < end)
    );
  }, [selectedAdv]);

  const handleChangeSelectedAdv = (value) => {
    setSelectedAdv(value);
  };

  const handleColumnDragged = (sourceIndex, destinationIndex) => {
    if (!beerTableColumns.length) {
      dispatch(setBeerTableColumns(columns));
    }
    dispatch(changeBeerTableColumn([sourceIndex, destinationIndex]));
  };

  const showModal = (e) => {
    setIsModalVisible(true);
    setModalTarget(e.target.text);
  };

  return (
    <Layout>
      <BeerListTableWrapper>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        {isLoading ? (
          <Loading tip="Loading..." />
        ) : (
          <MaterialTable
            columns={beerTableColumns.length ? beerTableColumns : columns}
            data={filteredData.length ? filteredData : data}
            title="Beer List: Click! on a beer name to see details🍺"
            options={{ paging: false }}
            onColumnDragged={handleColumnDragged}
            actions={[
              {
                onClick: () => {}, // Handle error: Invalid prop `actions[0]` supplied to `MaterialTable`
                isFreeAction: true,
                tooltip: "Filter by abv",
                icon: () => (
                  <Select
                    defaultValue="All"
                    style={{ width: 100 }}
                    onChange={handleChangeSelectedAdv}
                  >
                    {["All", 1, 2, 3, 4, 5, 6, 7].map((v) => (
                      <Select.Option
                        key={v}
                        value={v === "All" ? "All" : `${v}~${v + 1}`}
                      >
                        {v === "All" ? "All" : `${v}~${v + 1}`}
                      </Select.Option>
                    ))}
                  </Select>
                ),
              },
            ]}
          />
        )}
        {isModalVisible && (
          <BeerDetailInfo
            isModalVisible={isModalVisible}
            handleChangeVisible={setIsModalVisible}
            target={modalTarget}
          />
        )}
      </BeerListTableWrapper>
    </Layout>
  );
};

export default BeerList;

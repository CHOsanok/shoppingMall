import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";

const OrderTable = ({ header, data, openEditForm }) => {
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title) => (
              <th key={title}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.orderNum} onClick={() => openEditForm(item)}>
                <th>{index + 1}</th>
                <th>{item.orderNum}</th>
                <th>{item.createdAt.slice(0, 10)}</th>
                <th>{item.userId.email}</th>
                {item.items.length > 0 ? (
                  <th>
                    {item.items[0].productId.name}
                    {item.items.length > 1 && `외 ${item.items.length - 1}개`}
                  </th>
                ) : (
                  <th></th>
                )}

                <th>{item.shipTo.address + " " + item.shipTo.city}</th>

                <th>{item.totalPrice.toLocaleString()}</th>
                <th>
                  <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <th>No Data to show</th>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default OrderTable;

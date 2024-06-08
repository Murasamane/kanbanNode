    // 1. Take a snapshot of the current board before update
    // const oldBoard = await Board.findById(req.params.id).populate({
    //   path: "columns",
    //   populate: {
    //     path: "tasks",
    //     model: "Task",
    //   },
    // });

    // // 2. Update the board
    // const updatedBoard = await Board.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   {
    //     new: true,
    //     runValidators: true,
    //   }
    // );

    // // 3. Check the provided columns array and compare it to the snapshot
    // const oldColumnIds = oldBoard.columns.map((column) =>
    //   column._id.toString()
    // );
    // const newColumnIds = updatedBoard.columns.map((column) =>
    //   column._id.toString()
    // );

    // // Find removed columns
    // const removedColumnIds = oldColumnIds.filter(
    //   (id) => !newColumnIds.includes(id)
    // );

    // // Remove the columns from the columns collection
    // for (const id of removedColumnIds) {
    //   const column = await Column.findById(id);
    //   // Remove the tasks associated with this column as well
    //   for (const taskId of column.tasks) {
    //     await Task.findByIdAndDelete(new ObjectId(taskId));
    //   }
    //   await Column.findByIdAndDelete(id);
    // }
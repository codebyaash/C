const SHEET_NAME = 'Expenses';
const HEADERS = ['id', 'description', 'amount', 'category', 'date', 'spentBy', 'notes', 'createdAt', 'updatedAt'];

function doGet(e) {
  const action = e.parameter.action || 'list';
  const payload = JSON.parse(e.parameter.payload || '{}');

  if (action === 'list') {
    return output_({ ok: true, expenses: readExpenses_() }, e.parameter.callback);
  }

  if (payload.action === 'replaceAll') {
    writeExpenses_(payload.expenses || []);
    return output_({ ok: true, count: payload.expenses.length }, e.parameter.callback);
  }

  if (action === 'replaceAll') {
    writeExpenses_(payload.expenses || []);
    return output_({ ok: true, count: payload.expenses.length }, e.parameter.callback);
  }

  if (action === 'upsert') {
    const expense = payload.expense;
    if (!expense || !expense.id) {
      return output_({ ok: false, error: 'Missing expense' }, e.parameter.callback);
    }

    upsertExpense_(expense);
    return output_({ ok: true, expense: expense }, e.parameter.callback);
  }

  if (action === 'delete') {
    deleteExpense_(Number(payload.id));
    return output_({ ok: true, id: Number(payload.id) }, e.parameter.callback);
  }

  return output_({ ok: false, error: 'Unknown action' }, e.parameter.callback);
}

function doPost(e) {
  const payload = JSON.parse(e.parameter.payload || '{}');

  if (payload.action === 'replaceAll') {
    writeExpenses_(payload.expenses || []);
    return output_({ ok: true, count: payload.expenses.length });
  }

  if (payload.action === 'upsert') {
    upsertExpense_(payload.expense);
    return output_({ ok: true, expense: payload.expense });
  }

  if (payload.action === 'delete') {
    deleteExpense_(Number(payload.id));
    return output_({ ok: true, id: Number(payload.id) });
  }

  return output_({ ok: false, error: 'Unknown action' });
}

function readExpenses_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  return sheet
    .getRange(2, 1, lastRow - 1, HEADERS.length)
    .getValues()
    .filter(row => row.some(value => value !== ''))
    .map(row => ({
      id: Number(row[0]),
      description: String(row[1] || ''),
      amount: Number(row[2]) || 0,
      category: String(row[3] || ''),
      date: formatSheetDate_(row[4]),
      spentBy: String(row[5] || ''),
      notes: String(row[6] || ''),
      createdAt: String(row[7] || ''),
      updatedAt: String(row[8] || '')
    }));
}

function writeExpenses_(expenses) {
  const sheet = getSheet_();
  sheet.clearContents();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  if (!expenses.length) {
    return;
  }

  const rows = expenses.map(expense => [
    expense.id,
    expense.description,
    expense.amount,
    expense.category,
    expense.date,
    expense.spentBy,
    expense.notes,
    expense.createdAt,
    expense.updatedAt || ''
  ]);

  sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
}

function upsertExpense_(expense) {
  const sheet = getSheet_();
  const row = findExpenseRow_(Number(expense.id));
  const values = [expenseToRow_(expense)];

  if (row) {
    sheet.getRange(row, 1, 1, HEADERS.length).setValues(values);
  } else {
    sheet.appendRow(values[0]);
  }
}

function deleteExpense_(id) {
  const sheet = getSheet_();
  const row = findExpenseRow_(id);

  if (row) {
    sheet.deleteRow(row);
  }
}

function findExpenseRow_(id) {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return null;
  }

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let index = 0; index < ids.length; index++) {
    if (Number(ids[index][0]) === id) {
      return index + 2;
    }
  }

  return null;
}

function expenseToRow_(expense) {
  return [
    Number(expense.id),
    String(expense.description || ''),
    Number(expense.amount) || 0,
    String(expense.category || ''),
    String(expense.date || ''),
    String(expense.spentBy || ''),
    String(expense.notes || ''),
    String(expense.createdAt || ''),
    String(expense.updatedAt || '')
  ];
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  return sheet;
}

function formatSheetDate_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return String(value || '');
}

function output_(payload, callback) {
  if (callback && /^[A-Za-z_$][\w$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(payload) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

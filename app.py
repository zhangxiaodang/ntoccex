import json
import datetime
from flask import Flask, request, render_template
from ops.core.rpc import call_jy_reply
from ops.trans.utils import call_jy_asy
from utils import checkMobile

app = Flask(__name__, template_folder='view')


@app.route('/')
def index():
    # 主页面
    userAgent = request.headers['User-Agent']

    if checkMobile(userAgent):
        return render_template('wap.html')
    else:
        return 'web'


@app.route('/web', methods=['GET', 'POST'])
def pay():
    """
    # PC支付页面
    """
    return render_template('pay.html')


@app.route('/wap')
def wap_index():
    """
    # 手机支付页面
    """
    return render_template('wap.html')


@app.route('/wap/back', methods=['POST'])
def wap_back():
    """
    # 手机支付完成返回页面
    """
    data = request.form.to_dict()
    if data['status'] == 'SUCCESS':
        data['status'] = '交易成功'
    else:
        data['status'] = '交易失败'

    # 金额
    data['amt'] = '%.2f' % (float(data['total_amount']) / 100)
    # 订单日期
    data['order_date'] = data['order_date'][:4] + '-' + data['order_date'][4:6] + '-' + data['order_date'][6:8]
    return render_template('wapback.html', data=data)


@app.route('/wap/pay', methods=['POST'])
def wap_pay():
    """
    # 手机端支付
    """

    data = {}
    data['success'] = 'success'
    try:
        # 取得json数据
        page_data = request.form.to_dict()

        # 组织发送报文
        buf = {}
        # 报文头
        head = {}
        head['token'] = '000000'
        head['ptm'] = 'FS000000'
        head['timestamp'] = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + str(datetime.datetime.now().microsecond)[:4]
        head['translsh'] = 'FS000000' + head['timestamp']
        head['transid'] = '003S0001'
        # 报文体
        reqdata = {}
        reqdata['page_return_url'] = 'http://www.ntoccex.com:9999/wap/back'
        #reqdata['biz_type'] = 'WapGwDirectPayment'
        reqdata['biz_type'] = 'GWDirectPay'
        reqdata['client_ip'] = request.remote_addr
        reqdata['bank_abbr'] = 'CPB2C'
        #reqdata['bank_abbr'] = 'UNIONB2C'
        reqdata['amt'] = page_data['money']
        reqdata['phone'] = page_data['phone']
        reqdata['goods_name'] = 'AA'
        reqdata['goods_desc'] = 'aa'
        reqdata['valid_num'] = '1'
        buf['head'] = head
        buf['reqdata'] = reqdata

        # 发送交易
        buf_fk = json.loads(call_jy_reply('JRZX_S', json.dumps(buf).encode('utf-8')).decode('utf-8'))

        if buf_fk['head']['rspcode'] == '0000':
            # 成功时
            data['html'] = buf_fk['rspdata']['html']
        else:
            # 失败时
            data['success'] = 'failure'
            data['msg'] = buf_fk['head']['rspinfo']
    except:
        import traceback
        traceback.print_exc()
        data['success'] = 'failure'
        data['msg'] = '后台组织数据时异常'

    # 返回
    return json.dumps(data)


@app.route('/xlpay/notify', methods=['POST'])
def xlpay_notify():
    """
    # 支付结果后台通知URL
    """
    post_data = request.form.to_dict()
    # 组织发送报文
    buf = {}
    # 报文头
    head = {}
    head['token'] = '000000'
    head['ptm'] = 'FS000000'
    head['timestamp'] = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + str(datetime.datetime.now().microsecond)[:4]
    head['translsh'] = 'FS000000' + head['timestamp']
    head['transid'] = '003S0001'
    # 报文体
    reqdata = {}
    reqdata['status'] = post_data['status'] or ''
    reqdata['order_date'] = post_data['order_date'] or ''
    reqdata['order_id'] = post_data['order_id'] or ''
    reqdata['message_code'] = post_data['message_code'] or ''
    reqdata['message_desc'] = post_data['message_desc'] or ''
    reqdata['ac_date'] = post_data['ac_date'] or ''
    reqdata['pay_date'] = post_data['pay_date'] or ''
    reqdata['fee'] = post_data['fee'] or '0'
    buf['head'] = head
    buf['reqdata'] = reqdata

    # 发送交易
    fsxx = '%s%s%s' % (str(len(buf)+20).ljust(4,' '), 'XL_0002'.ljust(16, ' '), json.dumps(buf))
    print('要发送的报文为【%s】' % fsxx)
    call_jy_asy(fsxx.encode('utf-8'))

    return json.dumps({'result':'success'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)
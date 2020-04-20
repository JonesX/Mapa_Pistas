package principal;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.JSONException;

@ServerEndpoint("/servidor")
public class principal {
	
	private static Set<Session> userSessions = Collections.synchronizedSet(new HashSet<Session>());
	private MensagensKafka msgKafka = null;
	
	private void iniciarKafka() {
		
		if(msgKafka == null) {
			msgKafka = new MensagensKafka();
			new Thread(msgKafka).start();
		}
		
	}
	
	@OnOpen
	public void abrirConexao(Session userSession) {
		userSessions.add(userSession);
		this.iniciarKafka();
	}

	public static void enviarMensagem(String jMsg)  {

		try {

			for(Session s: userSessions) {
				if(s.isOpen()) {
					try {
						s.getBasicRemote().sendText(jMsg);
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
}